import React, { Fragment } from "react";
import PropTypes from "prop-types";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from: number, to: number, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

class PagesBar extends React.Component <{
  totalPages: number, 
  gotoPage: any,
  currentPage:number, 
  onPageChanged: any, 
  totalRecords: number, 
  pageLimit: number},{}> {
  pageNeighbours: number;
  static propTypes: { 
    pageNeighbours: PropTypes.Requireable<number>;};
  constructor(props:any) {
    super(props);
    const { pageNeighbours = 0 } = props;

    this.pageNeighbours =
      typeof pageNeighbours === "number"
        ? Math.max(0, Math.min(pageNeighbours, 2))
        : 0;


    this.state = { currentPage: this.props.currentPage };
  }

  componentDidMount() {
    this.props.gotoPage(1);
  }

  handleClick = (page: string | number, evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    evt.preventDefault();
    this.props.gotoPage(page);
  };

  handleMoveLeft = (evt: { preventDefault: () => void; }) => {
    evt.preventDefault();
    this.props.gotoPage(this.props.currentPage - this.pageNeighbours * 2 - 1);
  };

  handleMoveRight = (evt: { preventDefault: () => void; }) => {
    evt.preventDefault();
    this.props.gotoPage(this.props.currentPage + this.pageNeighbours * 2 + 1);
  };

  fetchPageNumbers = () => {
    const totalPages = this.props.totalPages;
    const currentPage = this.props.currentPage;
    const pageNeighbours = this.pageNeighbours;

    const totalNumbers = this.pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = currentPage - pageNeighbours;
      const rightBound = currentPage + pageNeighbours;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  render() {
    if (!this.props.totalRecords) return null;

    if (this.props.totalPages === 1) return null;

    const { currentPage } = this.props;
    const pages = this.fetchPageNumbers();

    return (
      <Fragment>
        <nav aria-label="Countries Pagination">
          <ul className="pagination">
            {pages.map((page, index) => {
              if (page === LEFT_PAGE)
                return (
                  <li key={index} className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      aria-label="Previous"
                      onClick={this.handleMoveLeft}
                    >
                      <span aria-hidden="true">&laquo;</span>
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                );

              if (page === RIGHT_PAGE)
                return (
                  <li key={index} className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      aria-label="Next"
                      onClick={this.handleMoveRight}
                    >
                      <span aria-hidden="true">&raquo;</span>
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                );

              return (
                <li
                  key={index}
                  className={`page-item${
                    currentPage === page ? " active" : ""
                  }`}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={e => this.handleClick(page, e)}
                  >
                    {page}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Fragment>
    );
  }
}

PagesBar.propTypes = {
  pageNeighbours: PropTypes.number,
};

export default PagesBar;
