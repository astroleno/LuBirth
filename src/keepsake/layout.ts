export function layoutBirthCard(sourceWidth: number, sourceHeight: number, contextLines: number) {
  if (![sourceWidth, sourceHeight].every(value => Number.isFinite(value) && value > 0)) throw new Error('截图尺寸无效。');
  const width = Math.min(1800, Math.round(sourceWidth));
  const imageHeight = Math.round(width * sourceHeight / sourceWidth);
  const unit = width / 1000, padding = width * .065;
  const footerHeight = Math.ceil((580 + Math.max(0, contextLines - 3) * 38) * unit);
  return { width, height: imageHeight + footerHeight, imageHeight, unit, padding,
    contentWidth: width - padding * 2, footerY: imageHeight, footerHeight };
}

/** Keep the original visible label readable on the complete exported image. */
export function layoutInkoLabel(width: number, height: number, label: { width: number; height: number; textHeight: number }) {
  const textHeight = Math.ceil(Math.min(width, height) * .053);
  const ratio = textHeight / label.textHeight;
  const labelWidth = label.width * ratio, labelHeight = label.height * ratio;
  return { x: width * .935 - labelWidth, y: height - width * .03 - labelHeight,
    width: labelWidth, height: labelHeight, textHeight };
}
