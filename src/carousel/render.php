<?php

/**
 * @var $attributes
 */
$items = $attributes['items'];
$image_width = $attributes['imageSettings']['width'];
$image_height = $attributes['imageSettings']['height'];
$image_border_radius = $attributes['imageSettings']['borderRadius'];

$gap = max(0, $attributes['carouselSettings']['gaps'] ?? 30);
$rows = max(1, $attributes['carouselSettings']['rows'] ?? 2);
$max_cols = max(1, $attributes['carouselSettings']['maxCols'] ?? 1);
$carousel_id = uniqid("carousel-");

?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <style>
        <?php echo "#$carousel_id" ?> .bim-carousel-image-wrapper {
            border-radius: <?php echo "$image_border_radius" . "%" ?>;
            width: <?php echo $image_width . "px" ?>;
            height: <?php echo $image_height . "px" ?>;
        }
    </style>
    <div id="<?php echo $carousel_id ?>" class=bim-carousel-outer>
        <div class="swiper bim-carousel">
            <div class="swiper-wrapper">
                <?php
                foreach ($items as $item) {
                    $image_id = $item['imageId'];
                    $name = $item['text'];
                    $url = $item['url'];
                    $image_url = wp_get_attachment_image_url($image_id, 'full');
                ?>
                    <div class="swiper-slide bim-carousel-slide">
                        <div class="bim-carousel-slide-wrapper">
                            <div class="bim-carousel-image-wrapper">
                                <img src="<?php echo $image_url ?>" />
                            </div>
                            <div class="bim-carousel-text"><?php echo $name ?></div>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </div>
        <div class="swiper-pagination bim-carousel-pagination"></div>
    </div>
    <script>
        (() => {
            const carouselId = "<?php echo $carousel_id ?>";
            const imageWidth = <?php echo $image_width ?>;
            const imageHeight = <?php echo $image_height ?>;
            const gap = <?php echo $gap ?>;
            const rows = <?php echo $rows ?>;
            const maxCols = <?php echo $max_cols ?>;

            let maxItemHeight = 0;
            let maxItemWidth = 0;
            document.querySelectorAll(`#${carouselId} .bim-carousel-slide-wrapper`)
                .forEach((slide) => {
                    const {
                        width,
                        height
                    } = slide.getBoundingClientRect();
                    maxItemHeight = Math.max(height, maxItemHeight);
                    maxItemWidth = Math.max(width, maxItemWidth);
                });

            document.querySelectorAll(`#${carouselId} .bim-carousel-slide`)
                .forEach((slide) => {
                    slide.style.height = `${maxItemHeight}px`;
                });

            const swiperHeight = rows * maxItemHeight + (rows - 1) * gap;
            const swiperStyle = document.querySelector(`#${carouselId} .swiper`)?.style;
            if (swiperStyle != null) {
                swiperStyle.height = `${swiperHeight}px`;
            }

            const breakpoints = {};
            for (let i = 2; i <= maxCols; i += 1) {
                breakpoints[i * maxItemWidth + (i - 1) * gap] = {
                    slidesPerView: i,
                };
            }

            const swiper = new Swiper(`#${carouselId} .swiper`, {
                slidesPerView: 1,
                grid: {
                    rows: rows,
                },
                spaceBetween: 30,
                breakpointBase: "container",
                breakpoints: breakpoints,
                pagination: {
                    el: `#${carouselId} .swiper-pagination`,
                    clickable: true
                },
            });
        })();
    </script>
</div>