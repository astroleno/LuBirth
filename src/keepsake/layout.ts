const INKO_TEXT_HEIGHT_RATIO = .053;
const INKO_BOTTOM_MARGIN_RATIO = .03;

export function layoutBirthCard(sourceWidth: number, sourceHeight: number, footerContentHeight: number,
  label?: { height: number; textHeight: number }) {
  if (![sourceWidth, sourceHeight].every(value => Number.isFinite(value) && value > 0)) throw new Error('截图尺寸无效。');
  const width = Math.min(1800, Math.round(sourceWidth));
  const imageHeight = Math.round(width * sourceHeight / sourceWidth);
  const unit = width / 1000, padding = width * .065;
  const maxLabelHeight = Math.ceil(width * INKO_TEXT_HEIGHT_RATIO) * (label ? label.height / label.textHeight : 1);
  const footerHeight = Math.ceil(footerContentHeight + 22 * unit + maxLabelHeight + width * INKO_BOTTOM_MARGIN_RATIO);
  return { width, height: imageHeight + footerHeight, imageHeight, unit, padding,
    contentWidth: width - padding * 2, footerY: imageHeight, footerHeight };
}

/** Keep the original visible label readable on the complete exported image. */
export function layoutInkoLabel(width: number, height: number, label: { width: number; height: number; textHeight: number }) {
  const textHeight = Math.ceil(Math.min(width, height) * INKO_TEXT_HEIGHT_RATIO);
  const ratio = textHeight / label.textHeight;
  const labelWidth = label.width * ratio, labelHeight = label.height * ratio;
  return { x: width * .935 - labelWidth, y: height - width * INKO_BOTTOM_MARGIN_RATIO - labelHeight,
    width: labelWidth, height: labelHeight, textHeight };
}
