<?php


function bim_widgets_carousel_register_block()
{
    // Register the block by passing the location of block.json to register_block_type.
    register_block_type(__DIR__);
}

add_action('init', 'bim_widgets_carousel_register_block');