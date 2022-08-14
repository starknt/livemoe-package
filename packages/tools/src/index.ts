import fs from 'fs'
import Bindings from 'bindings'

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

let Addon: Tools
try {
  Addon = Bindings('tools')
}
catch (error) {
  try {
    Addon = Bindings('tool')
  }
  catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export const GetSysTaskbarState = Addon.GetSysTaskbarState
export const GetSysListViewIconRect = Addon.GetSysListViewIconRect
export const SetWindowInWorkerW = Addon.SetWindowInWorkerW
export const RestoreWorkerW = Addon.RestoreWorkerW
export const CheckAeroEnable = Addon.CheckAeroEnable
export const EnableAero = Addon.EnableAero
export const SetTaskbar = Addon.SetTaskbar
export const RestoreTaskbar = Addon.RestoreTaskbar
export const SetSystemCursorToNode = Addon.SetSystemCursorToNode
export const RestoreSystemCursor = Addon.RestoreSystemCursor
export const ShowDesktopIcon = Addon.ShowDesktopIcon
export const HideDesktopIcon = Addon.HideDesktopIcon
export const ShowShellWindow = Addon.ShowShellWindow
export const HideShellWindow = Addon.HideShellWindow
export const QueryUserState = Addon.QueryUserState
export const IsInDesktop = Addon.IsInDesktop
