'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Bindings = require('bindings');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const Bindings__default = /*#__PURE__*/_interopDefaultLegacy(Bindings);

var ACCENT = /* @__PURE__ */ ((ACCENT2) => {
  ACCENT2[ACCENT2["ACCENT_ENABLE_GRADIENT"] = 1] = "ACCENT_ENABLE_GRADIENT";
  ACCENT2[ACCENT2["ACCENT_ENABLE_TRANSPARENTGRADIENT"] = 2] = "ACCENT_ENABLE_TRANSPARENTGRADIENT";
  ACCENT2[ACCENT2["ACCENT_ENABLE_BLURBEHIND"] = 3] = "ACCENT_ENABLE_BLURBEHIND";
  ACCENT2[ACCENT2["ACCENT_ENABLE_FLUENT"] = 4] = "ACCENT_ENABLE_FLUENT";
  ACCENT2[ACCENT2["ACCENT_NORMAL"] = 150] = "ACCENT_NORMAL";
  return ACCENT2;
})(ACCENT || {});
const Addon = Bindings__default("tools");
const GetSysListViewPosition = Addon.GetSysListViewPosition;
const GetSysTaskbarState = Addon.GetSysTaskbarState;
const GetSysListViewIconRect = Addon.GetSysListViewIconRect;
const SetWindowInWorkerW = Addon.SetWindowInWorkerW;
const RestoreWorkerW = Addon.RestoreWorkerW;
const CheckAeroEnable = Addon.CheckAeroEnable;
const EnableAero = Addon.EnableAero;
const SetTaskbar = Addon.SetTaskbar;
const RestoreTaskbar = Addon.RestoreTaskbar;
const SetSystemCursorToNode = Addon.SetSystemCursorToNode;
const RestoreSystemCursor = Addon.RestoreSystemCursor;
const ShowDesktopIcon = Addon.ShowDesktopIcon;
const HideDesktopIcon = Addon.HideDesktopIcon;
const ShowShellWindow = Addon.ShowShellWindow;
const HideShellWindow = Addon.HideShellWindow;
const QueryUserState = Addon.QueryUserState;
const IsInDesktop = Addon.IsInDesktop;

exports.ACCENT = ACCENT;
exports.CheckAeroEnable = CheckAeroEnable;
exports.EnableAero = EnableAero;
exports.GetSysListViewIconRect = GetSysListViewIconRect;
exports.GetSysListViewPosition = GetSysListViewPosition;
exports.GetSysTaskbarState = GetSysTaskbarState;
exports.HideDesktopIcon = HideDesktopIcon;
exports.HideShellWindow = HideShellWindow;
exports.IsInDesktop = IsInDesktop;
exports.QueryUserState = QueryUserState;
exports.RestoreSystemCursor = RestoreSystemCursor;
exports.RestoreTaskbar = RestoreTaskbar;
exports.RestoreWorkerW = RestoreWorkerW;
exports.SetSystemCursorToNode = SetSystemCursorToNode;
exports.SetTaskbar = SetTaskbar;
exports.SetWindowInWorkerW = SetWindowInWorkerW;
exports.ShowDesktopIcon = ShowDesktopIcon;
exports.ShowShellWindow = ShowShellWindow;
