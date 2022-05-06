import React, { useEffect, useRef, useState } from 'react';
import PoiCard from './PoiCard';
import PagesBar from './PagesBar';

import '../styles/PoiList.css'
import { PrimaryButton } from '@fluentui/react';

function PoiList(props: any) {
  const poiList = useRef(props.poiList)
  const [currentPoi, setCurrentPoi] = useState(Array)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageLimit = 10
  let totalPoi = poiList.current.length

  function onPageChanged(data: any) {
    const { currentPage, totalPages, pageLimit } = data
    const offset = (currentPage - 1) * pageLimit
    const newPoiList = props.poiList.slice(offset, offset + pageLimit)

    if (newPoiList.length !== currentPoi.length) {
      setCurrentPage(currentPage)
      setCurrentPoi(newPoiList)
      setTotalPages(totalPages)
    }
  }

  function gotoPage(page: any) {
    setTotalPages(Math.ceil(totalPoi / pageLimit));
    const newPage = Math.max(1, Math.min(page, totalPages));
    const paginationData = {
      currentPage: newPage,
      totalPages: totalPages,
      pageLimit: pageLimit,
      totalRecords: totalPoi
    };
    setCurrentPage(newPage)

    onPageChanged(paginationData)
  };

  useEffect(() => {
    gotoPage(currentPage)
  })

  if (totalPoi === 0) { return null }
  const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();

  return (
    <div className="container mb-5">
      <div className="row d-flex flex-row py-5">
        <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
          <div className="d-flex flex-row align-items-center">
            <h2 className={headerClass}>
              Stored spots: <strong className="text-secondary">{totalPoi}</strong>
            </h2>
            {currentPage && (
              <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                Page <span className="font-weight-bold">{currentPage}</span> /
                <span className="font-weight-bold">{totalPages}</span>
              </span>
            )}
          </div>
          <div className="d-flex flex-row py-4 align-items-center">
            <PagesBar
              totalRecords={totalPoi}
              pageLimit={pageLimit}
              pageNeighbours={1}
              onPageChanged={onPageChanged}
              currentPage={currentPage}
              gotoPage={gotoPage}
              totalPages={totalPages}
            />
          </div>
        </div>
        {currentPoi.map(
          (poi: any) => 
          <PoiCard
              key = {poi.key}
              poi={poi}
              onCrdChanged={props.onCrdChanged}
              changeSelectedBox={props.changeSelectedBox}
            />
        )}
      </div>
      <PrimaryButton id='delete-button'
        text='DELETE SELECTED'
        onClick={() => {
          props.deleteSelected()
        }}
      />
    </div>
  );
}

export default PoiList