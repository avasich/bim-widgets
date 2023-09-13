<?php
/**
 * @var $attributes
 */
$news = $attributes['news'];
$title = $attributes['title'];
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
    <h2 class="widget-title"><?php echo $title ?></h2>
    <ul class="bim-separated-list">
        <?php
        foreach ($news as $n) {
            $newsTitle = $n['title'];
            $subtitle = $n['subtitle'];
            $url = $n['url'];
            ?>
            <li class="bim-separated-list-item">
                <a href="<?php echo $url ?>">
                    <h3 class="bim-accent"><?php echo $newsTitle ?></h3>
                </a>
                <?php echo $subtitle ?>
            </li>
        <?php } ?>
    </ul>
</div>
