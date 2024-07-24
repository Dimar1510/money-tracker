function SampleNextArrow(props: any) {
  const { className, onClick } = props;
  return (
    <div
      className={className + " " + "before:text-primary before:content-['→']"}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: any) {
  const { className, onClick } = props;
  return (
    <div
      className={className + " " + "before:text-primary before:content-['←']"}
      onClick={onClick}
    />
  );
}

export const settings = {
  dots: true,
  infinite: true,
  dotsClass: "slick-dots first:bg-primary",
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};
