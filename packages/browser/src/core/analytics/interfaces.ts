import type { Analytics, AnalyticsSettings, InitOptions } from '.'
// import type {
//   DestinationMiddlewareFunction,
//   MiddlewareFunction,
// } from '../../plugins/middleware'
import type { Plugin } from '../plugin'
import type {
  EventParams,
  DispatchedEvent,
  PageParams,
  UserParams,
  AliasParams,
} from '../arguments-resolver'
import type { Context } from '../context'
import type { SegmentEvent } from '../events'
import type { Group } from '../user'
import type { LegacyIntegration } from '../../plugins/ajs-destination/types'

// we can define a contract because:
// - it gives us a neat place to put all our typedocs (they end up being inherited by the class that implements them).
// - it makes it easy to reason about what's being shared between browser and node

/**
 * All of these methods are a no-op.
 */
/** @deprecated */
interface AnalyticsClassicStubs {
  /** @deprecated */
  log(this: never): void
  /** @deprecated */
  addIntegrationMiddleware(this: never): void
  /** @deprecated */
  listeners(this: never): void
  /** @deprecated */
  addEventListener(this: never): void
  /** @deprecated */
  removeAllListeners(this: never): void
  /** @deprecated */
  removeListener(this: never): void
  /** @deprecated */
  removeEventListener(this: never): void
  /** @deprecated */
  hasListeners(this: never): void
  /** @deprecated */
  // This function is only used to add GA and Appcue, but these are already being added to Integrations by AJSN
  addIntegration(this: never): void
  /** @deprecated */
  add(this: never): void
}

/** @deprecated */
export interface AnalyticsClassic extends AnalyticsClassicStubs {
  /** @deprecated */
  initialize(
    settings?: AnalyticsSettings,
    options?: InitOptions
  ): Promise<Analytics>

  /** @deprecated */
  noConflict(): Analytics

  /** @deprecated */
  normalize(msg: SegmentEvent): SegmentEvent

  /** @deprecated */
  get failedInitializations(): string[]

  /** @deprecated */
  pageview(url: string): Promise<Analytics>

  /**  @deprecated*/
  get plugins(): any

  /** @deprecated */
  get Integrations(): Record<string, LegacyIntegration>
}

/**
 * This is implemented by node and browser
 */
export interface AnalyticsCore {
  track(...args: EventParams): Promise<DispatchedEvent>
  page(...args: PageParams): Promise<DispatchedEvent>
  identify(...args: UserParams): Promise<DispatchedEvent>
  // TODO: group function could be improved with method overloading (if there are no args, return group)
  group(...args: UserParams): Promise<DispatchedEvent> | Group
  alias(...args: AliasParams): Promise<DispatchedEvent>
  screen(...args: PageParams): Promise<DispatchedEvent>
  register(...plugins: Plugin[]): Promise<Context>
  deregister(...plugins: string[]): Promise<Context>

  // version() _was_ under the deprecated analytics classic but it was the only "non-deprecated method"
  // I think it deserves to be saved, as getting the Version via method could be useful going forward.
  get VERSION(): string
}

// TODO: this should be implemented by both Analytics and AnalyticsBrowser
/*
export interface AnalyticsBrowserCore {
  user(): User
  ready(callback: (arg: unknown[]) => unknown): Promise<unknown>
  debug(toggle: boolean): Analytics
  reset(): void
  timeout(timeout: number): void
  addSourceMiddleware(fn: MiddlewareFunction): Promise<Analytics>
  addDestinationMiddleware(
    integrationName: string,
    ...middlewares: DestinationMiddlewareFunction[]
  ): Promise<Analytics>
  setAnonymousId(id?: string): ID
  queryString(query: string): Promise<Context[]>
  trackClick(...args: LinkArgs): Promise<Analytics>
  trackLink(...args: LinkArgs): Promise<Analytics>
  trackSubmit(...args: FormArgs): Promise<Analytics>
  trackForm(...args: FormArgs): Promise<Analytics>
}
*/
