import Bindings from 'bindings'

export interface POINT {
  x: number
  y: number
}

export interface RECT {
  left: number
  top: number
  right: number
  bottom: number
}

export interface TaskbarState {
  align: 'Left' | 'Right' | 'Top' | 'Bottom'
  rc: RECT
}

export const enum ACCENT { // Values passed to SetWindowCompositionAttribute determining the appearance of a window
  ACCENT_ENABLE_GRADIENT = 1, // Use a solid color specified by nColor. This mode ignores the alpha value and is fully opaque.
  ACCENT_ENABLE_TRANSPARENTGRADIENT = 2, // Use a tinted transparent overlay. nColor is the tint color.
  ACCENT_ENABLE_BLURBEHIND = 3, // Use a tinted blurry overlay. nColor is the tint color.
  ACCENT_ENABLE_FLUENT = 4, // Use an aspect similar to Fluent design. nColor is tint color. This mode bugs if the alpha value is 0.

  ACCENT_NORMAL = 150, // (Fake value) Emulate regular taskbar appearance
}

export interface TASKBAR_APPEARANCE {
  ACCENT: ACCENT
  COLOR: number
}

export interface CursorStyleSheet {
  APPSTARTING: string
  Normal: string
  Hand: string
  Cross: string
  IBeam: string
  No: string
  SizeAll: string
  SizeNESW: string
  SizeNS: string
  SizeNWSE: string
  SizeWE: string
  SizeUpArrow: string
  SizeWait: string
}

export interface Tools {
  GetSysListViewPosition: () => Array<POINT>
  GetSysTaskbarState: () => TaskbarState
  GetSysListViewIconRect: () => Array<RECT>
  SetWindowInWorkerW: (hWnd: number) => boolean
  RestoreWorkerW: () => boolean
  CheckAeroEnable: () => boolean
  EnableAero: () => boolean
  SetTaskbar: (appearance: TASKBAR_APPEARANCE) => boolean
  RestoreTaskbar: () => boolean
  SetSystemCursorToNode: (styleSheet: CursorStyleSheet) => boolean
  RestoreSystemCursor: () => boolean
  ShowDesktopIcon: () => boolean
  HideDesktopIcon: () => boolean
  ShowShellWindow: () => boolean
  HideShellWindow: () => boolean
  QueryUserState: () => number
  IsInDesktop: () => boolean
}

const Addon: Tools = Bindings('tools')

export default {
  GetSysListViewPosition: Addon.GetSysListViewPosition,
  GetSysTaskbarState: Addon.GetSysTaskbarState,
  GetSysListViewIconRect: Addon.GetSysListViewIconRect,
  SetWindowInWorkerW: Addon.SetWindowInWorkerW,
  RestoreWorkerW: Addon.RestoreWorkerW,
  CheckAeroEnable: Addon.CheckAeroEnable,
  EnableAero: Addon.EnableAero,
  SetTaskbar: Addon.SetTaskbar,
  RestoreTaskbar: Addon.RestoreTaskbar,
  SetSystemCursorToNode: Addon.SetSystemCursorToNode,
  RestoreSystemCursor: Addon.RestoreSystemCursor,
  ShowDesktopIcon: Addon.ShowDesktopIcon,
  HideDesktopIcon: Addon.HideDesktopIcon,
  ShowShellWindow: Addon.ShowShellWindow,
  HideShellWindow: Addon.HideShellWindow,
  QueryUserState: Addon.QueryUserState,
  IsInDesktop: Addon.IsInDesktop,
}
