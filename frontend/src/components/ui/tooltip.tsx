import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "cn";

interface TooltipProps extends Omit<BaseTooltip.Root.Props, "children"> {
  /** The element that triggers the tooltip on hover/focus */
  children: React.ReactNode;
  /** Content to display inside the tooltip popup */
  content: React.ReactNode;
  /** Positioning side relative to the trigger */
  side?: BaseTooltip.Positioner.Props["side"];
  /** Alignment along the target side */
  align?: BaseTooltip.Positioner.Props["align"];
  /** Distance from trigger in pixels */
  sideOffset?: number;
  /** Base UI positioner props passed through verbatim */
  positionerProps?: Omit<
    BaseTooltip.Positioner.Props,
    "side" | "align" | "sideOffset"
  > & {
    side?: BaseTooltip.Positioner.Props["side"];
    align?: BaseTooltip.Positioner.Props["align"];
    sideOffset?: number;
  };
  /** Base UI popup props passed through verbatim */
  popupProps?: BaseTooltip.Popup.Props;
  /** Base UI arrow props passed through verbatim */
  arrowProps?: BaseTooltip.Arrow.Props;
  /** Render the tooltip arrow indicator */
  showArrow?: boolean;
  /** Custom classNames for easy styling target */
  classNames?: {
    popup?: string;
    arrow?: string;
  };
  delay?: number;
}

function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 6,
  positionerProps,
  popupProps,
  arrowProps,
  showArrow = true,
  classNames,
  delay = 50,
  ...rootProps
}: TooltipProps) {
  const resolvedPositionerProps = {
    ...positionerProps,
    side: positionerProps?.side ?? side,
    align: positionerProps?.align ?? align,
    sideOffset: positionerProps?.sideOffset ?? sideOffset,
  };

  const { className: popupClassName, ...restPopupProps } = popupProps ?? {};
  const { className: arrowClassName, ...restArrowProps } = arrowProps ?? {};

  return (
    <BaseTooltip.Provider delay={delay}>
      <BaseTooltip.Root disableHoverablePopup={true} {...rootProps}>
        <BaseTooltip.Trigger render={children as React.ReactElement} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner {...resolvedPositionerProps}>
            <BaseTooltip.Popup
              {...restPopupProps}
              className={cn(
                `relative
                h-var(--popup-height,auto) w-var(--popup-width,auto)
                max-w-125
                rounded-md
                px-2 py-1
                shadow-[0_0_0_1px_var(--color-zinc-700),0_1px_0_0_var(--color-zinc-500),0_2px_7px_0_rgba(0,0,0,0.06),inset_0_1px_0_0_var(--color-zinc-500)]
                bg-zinc-700 dark:bg-neutral-950
                text-xs font-medium text-white
                transition-all duration-150 ease-out origin-top
                data-starting-style:opacity-0 data-starting-style:scale-95
                data-ending-style:opacity-0 data-ending-style:scale-95`,
                classNames?.popup,
                popupClassName,
              )}
            >
              {showArrow && (
                <BaseTooltip.Arrow
                  {...restArrowProps}
                  className={cn(classNames?.arrow, arrowClassName)}
                />
              )}
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

export type { TooltipProps };
export { Tooltip };
