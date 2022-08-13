#pragma once
#ifndef USER32_H
#define USER32_H
#include <functional>
#include "window.h"
#include "swca.h"

class user32
{

private:
    using pSetWindowCompositionAttribute = std::add_pointer_t<BOOL WINAPI(HWND, swca::WINCOMPATTRDATA *)>;

public:
    static const pSetWindowCompositionAttribute SetWindowCompositionAttribute;
};

void SetWindowBlur(const HWND &window, const swca::ACCENT &appearance, const uint32_t &color);

#endif // !USER32_H
