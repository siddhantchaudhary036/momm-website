"use client";

import { ReactNode } from "react";
import { IPhoneMockup } from "react-device-mockup";

/**
 * One place that decides what a "phone" looks like on this site:
 * dynamic-island iPhone, near-black frame, full-bleed screen
 * (status + nav bars hidden so momm's UI owns every pixel).
 */
export default function PhoneFrame({
  width = 240,
  children,
}: {
  width?: number;
  children: ReactNode;
}) {
  return (
    <IPhoneMockup
      screenWidth={width}
      screenType="island"
      frameColor="#05030A"
      hideStatusBar
      hideNavBar
    >
      {children}
    </IPhoneMockup>
  );
}
