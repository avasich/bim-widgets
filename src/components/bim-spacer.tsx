export const BimSpacer = ({
  width,
  height,
  className = "",
}: {
  width?: string;
  height?: string;
  className?: string;
}) => {
  return (
    <div className={`BimSpacer ${className}`} style={{ width, height }}></div>
  );
};
