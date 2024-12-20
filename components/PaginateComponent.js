import React from 'react';

const PaginateComponent = ({ currentPage, totalPages, onPageChange }) => {
    const [firstPage, setFirstPage] = React.useState(0);
    const [secondPage, setSecondPage] = React.useState(0);
    const [lastPage, setLastPage] = React.useState(0);

    const managePagination = () => {
        const isTheFirstPage = currentPage === 1;
        const isTheLastPage = currentPage === totalPages;

        if (isTheFirstPage) {
            setFirstPage({ number: currentPage, isActive: true });
            setSecondPage({ number: currentPage + 1, isActive: false });
            setLastPage({ number: currentPage + 2, isActive: false });
        } else if (isTheLastPage && totalPages > 2) {
            setFirstPage({ number: currentPage - 2, isActive: false });
            setSecondPage({ number: currentPage - 1, isActive: false });
            setLastPage({ number: currentPage, isActive: true });
        } else {
            setFirstPage({ number: currentPage - 1, isActive: false });
            setSecondPage({ number: currentPage, isActive: true });
            setLastPage({ number: currentPage + 1, isActive: false });
        }
    };

    React.useEffect(() => {
        managePagination();
    }, [currentPage, totalPages]);

    return (
        <nav aria-label="...">
            <ul className="pagination d-flex justify-content-center">
                <li className={`page-item ` + (currentPage == 1 ? 'disabled' : '')}>
                    <a className="page-link" href="#" onClick={() => onPageChange(currentPage - 1)}>
                        Anterior
                    </a>
                </li>
                <li className={`page-item ` + (firstPage.isActive ? 'active' : '')} aria-current="page">
                    <a className="page-link" href="#" onClick={() => onPageChange(firstPage.number)}>
                        {firstPage.number}
                    </a>
                </li>
                {totalPages > 1 && (
                <li className={`page-item ` + (secondPage.isActive ? 'active' : '')} aria-current="page">
                    <a className="page-link" href="#" onClick={() => onPageChange(secondPage.number)}>
                        {secondPage.number}
                    </a>
                </li>
                )}
                {totalPages > 2 && (
                    <li className={`page-item ` + (lastPage.isActive ? 'active' : '')} aria-current="page">
                        <a className="page-link" href="#" onClick={() => onPageChange(lastPage.number)}>
                            {lastPage.number}
                        </a>
                    </li>
                )}
                <li className={`page-item ` + (currentPage == totalPages ? 'disabled' : '')}>
                    <a className="page-link" href="#" onClick={() => onPageChange(currentPage + 1)}>
                        Proximo
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default PaginateComponent;
