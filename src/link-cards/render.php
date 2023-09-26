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
            $a_attr = empty($url ?? "") ? "" : "href='$url'";
        ?>
            <div class="bim-grid-col bim-grid-col-<?php echo $maxColumns ?>">
                <a <?php echo $a_attr ?> class="bim-card"">
                        <h3 class=" bim-card-title"><?php echo $cardTitle ?></h3>
                    <p class="bim-card-description"><?php echo $cardSubtitle ?></p>
                </a>
            </div>
        <?php } ?>
    </div>
</div>