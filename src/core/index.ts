import { EventQueue } from './queue/event-queue'
import { validate } from './validation'
import { Context } from './context'
import { eventFactory, SegmentEvent } from './events'
import { invokeCallback } from './callback'
import { Extension } from './extension'
import { User } from './user'

interface AnalyticsSettings {
  writeKey: string
  timeout?: number
  extensions?: Extension[]
  deliverInline?: boolean
}

type Callback = (ctx: Context | undefined) => Promise<unknown> | unknown

export class Analytics {
  queue: EventQueue
  settings: AnalyticsSettings
  private _user: User
  eventFactory: ReturnType<typeof eventFactory>

  private constructor(settings: AnalyticsSettings, queue: EventQueue, user: User) {
    this.settings = settings
    this.queue = queue
    this._user = user
    this.eventFactory = eventFactory(user)
  }

  static async load(settings: AnalyticsSettings): Promise<Analytics> {
    const queue = await EventQueue.init({
      extensions: settings.extensions ?? [],
      inline: settings.deliverInline,
    })

    const user = new User().load()
    return new Analytics(settings, queue, user)
  }

  user(): User {
    return this._user
  }

  async track(event: string, properties?: object, _options?: object, callback?: Callback): Promise<Context | undefined> {
    const segmentEvent = this.eventFactory.track(event, properties ?? {})
    return this.dispatch('track', segmentEvent, callback)
  }

  async identify(userId?: string, traits?: object, _options?: object, callback?: Callback): Promise<Context | undefined> {
    if (userId) {
      this._user.id(userId)
    }

    if (traits) {
      this._user.traits(traits)
    }

    const segmentEvent = this.eventFactory.identify(this._user.id(), this._user.traits())
    return this.dispatch('identify', segmentEvent, callback)
  }

  async register(extension: Extension): Promise<void> {
    return this.queue.register(extension)
  }

  // TODO: Add emitter

  ready(): void {
    // TODO: on ready
  }

  reset(): void {
    this._user.reset()
  }

  private async dispatch(type: string, event: SegmentEvent, callback?: Callback): Promise<Context | undefined> {
    const ctx = new Context(event)
    validate(type, event.properties ?? event.traits ?? {})

    const dispatched = await this.queue.dispatch(ctx)
    return invokeCallback(dispatched, callback, this.settings.timeout)
  }
}