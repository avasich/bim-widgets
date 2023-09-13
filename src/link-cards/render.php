<?php

/**
 * @var $attributes
 */
$cards = $attributes['cards'];
$maxColumns = $attributes['maxColumns'] ?? 3;
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <div class="bim-grid-small bim-grid bim-grid-<?php echo $maxColumns ?>">
        <?php
        foreach ($cards as $card) {
            $cardTitle = $card['title'];
            $cardSubtitle = $card['subtitle'];
            $url = $card['url'];
            ?>
            <div class="bim-grid-col bim-grid-col-<?php echo $maxColumns ?>">
                <!-- <div class="bim-card"> -->
                    <a class="bim-card" href="<?php echo $url ?>">
                        <h3 class="bim-card-title"><?php echo $cardTitle ?></h3>
                        <p class="bim-card-description"><?php echo $cardSubtitle ?></p>
                    </a>
                <!-- </div> -->
            </div>
        <?php } ?>
    </div>
</div>