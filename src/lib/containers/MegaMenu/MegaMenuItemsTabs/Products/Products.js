// @flow
import * as React from 'react'
import type { MegaMenuNavMenuItem } from '../../../../types/megaMenu_types'
import { createArchiveUrl } from '../../../../bcorpUrl'
import Tabs from '../../../Tabs/Tabs/Tabs'
import Tab from '../../../Tabs/Tab/Tab'
import BottomBar from '../../lib/Products/BottomBar/BottomBar'
import ProductCategoryBlock from '../../lib/Products/ProductCategoryBlock/ProductCategoryBlock'
import style from './Products.scss'

type Props = {
  menuItem: MegaMenuNavMenuItem
}

class Products extends React.Component<Props> {
  renderTabs () {
    let tabsArray = []

    // loop through all columns
    Object.keys(this.props.menuItem).forEach((key, index1) => {
      if (key.includes('bcorp_mega_menu_product_categories_col_')) {
        this.props.menuItem[key].forEach((prodCat, index2) => {
          tabsArray = [
            ...tabsArray,
            <Tab
              key={`${index1}_${index2}`}
              text={prodCat.name}
              image={prodCat.featured_image}
              link={createArchiveUrl(prodCat) || undefined}>
              <ProductCategoryBlock productCategory={prodCat} />
            </Tab>
          ]
        })
      }
    })

    return tabsArray
  }

  render () {
    return (
      <div className={`row ${style.productsWrapper}`}>
        <div className={style.categoriesWrapper}>
          <Tabs
            defaultActiveTabIndex={0}
            tabClassName={style.productTab}
            activeTabClassName={style.activeContent}>
            {this.renderTabs()}
          </Tabs>
        </div>
        <div className={style.bottomBarWrapper}>
          <BottomBar productMegaMenuItem={this.props.menuItem} stack />
        </div>
      </div>
    )
  }
}

export default Products
