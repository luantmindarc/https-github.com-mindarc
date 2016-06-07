<?php

/*
 * @copyright  Copyright (c) 2013 by  ESS-UA.
 */

class Ess_M2ePro_Model_Ebay_Magento_Product_Rule_Custom_EbayStartPrice
    extends Ess_M2ePro_Model_Magento_Product_Rule_Custom_Abstract
{
    // #################################################

    public function getAttributeCode()
    {
        return 'ebay_online_start_price';
    }

    public function getLabel()
    {
        return Mage::helper('M2ePro')->__('Start Price');
    }

    public function getInputType()
    {
        return 'price';
    }

    public function getValueByProductInstance(Mage_Catalog_Model_Product $product)
    {
        return $product->getData('online_start_price');
    }

    // #################################################
}