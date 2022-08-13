#include "user32.h"

const user32::pSetWindowCompositionAttribute user32::SetWindowCompositionAttribute =
    reinterpret_cast<pSetWindowCompositionAttribute>(
        GetProcAddress(GetModuleHandle(TEXT("user32.dll")), "SetWindowCompositionAttribute"));

void SetWindowBlur(const HWND &window, const swca::ACCENT &appearance, const uint32_t &color)
{
    if (user32::SetWindowCompositionAttribute)
    {
        swca::ACCENTPOLICY policy = {
            appearance,
            2,
            (color & 0xFF00FF00) + ((color & 0x00FF0000) >> 16) + ((color & 0x000000FF) << 16),
            0};

        if (policy.nAccentState == swca::ACCENT::ACCENT_ENABLE_FLUENT && policy.nColor >> 24 == 0x00)
        {
            // Fluent mode doesn't likes a completely 0 opacity
            policy.nColor = (0x01 << 24) + (policy.nColor & 0x00FFFFFF);
        }

        swca::WINCOMPATTRDATA data = {
            swca::WindowCompositionAttribute::WCA_ACCENT_POLICY,
            &policy,
            sizeof(policy)};

        user32::SetWindowCompositionAttribute(window, &data);
    }
}