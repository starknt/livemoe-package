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
const index = {
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
  IsInDesktop: Addon.IsInDesktop
};

exports.ACCENT = ACCENT;
exports["default"] = index;
