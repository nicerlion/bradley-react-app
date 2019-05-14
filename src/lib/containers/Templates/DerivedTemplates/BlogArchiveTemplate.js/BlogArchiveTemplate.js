// @flow
import * as React from 'react'
import type { FiltersType } from '../../../ArchiveFilters/ArchiveFilters'
import ArchiveFilters from '../../../ArchiveFilters/ArchiveFilters'
import BlogArchiveItems from './BlogArchiveItems/BlogArchiveItems'
import CentredTemplate from '../../CentredTemplate/CentredTemplate'
import style from './BlogArchiveTemplate.scss'

/**
 * Using the ArchiveFilters as the filter state manager,
 * we combine the filters with the list of blog post items
 * and render them within a Centred Template.
 */

type Props = {
  /**
   * The page template data
   */
  data: {
    page_id: number,
    page_title: string
  }
}

class BlogArchiveTemplate extends React.Component<Props> {
  renderBlogArchiveItems (filters: FiltersType) {
    return (
      <div className={style.blogArchiveFiltersContent}>
        <BlogArchiveItems filters={filters} pageID={this.props.data.page_id} />
      </div>
    )
  }

  renderContent () {
    return (
      <ArchiveFilters
        data={this.props.data}
        yearStart={2000}
        renderContent={this.renderBlogArchiveItems.bind(this)}
      />
    )
  }

  render () {
    console.log(this.state)
    return (
      <div className={style.BlogArchiveTemplate}>
        <CentredTemplate
          data={this.props.data}
          renderModules={this.renderContent.bind(this)}
        />
      </div>
    )
  }
}

export default BlogArchiveTemplate
