function toggleSideNav() {
    var sideNav = document.getElementById('sideNav');
    var overlay = document.querySelector('.side-nav-overlay');

    if (sideNav.classList.contains('open')) {
        sideNav.classList.remove('open');
        overlay.style.display = 'none'; // Hide overlay
    } else {
        sideNav.classList.add('open');
        overlay.style.display = 'block'; // Show overlay
    }
}


function clearForm() {
    document.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], select').forEach((input) => {
        input.value = '';
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Constants for pagination
    const rowsPerPage = 10; // Number of rows to display per page
    let currentPage = 1; // Current page
    let totalPages; // Total number of pages
    let sortColumnIndex = -1; // Index of the column to sort
    let sortDirection = 'asc'; // Initial sort direction

    // Function to fetch data from CSV file and populate the table based on the page number
    function populateTable(pageNumber) {
        const startIndex = (pageNumber - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;

        fetch('../data/2019-2023.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                totalPages = Math.ceil(rows.length / rowsPerPage);
                generatePaginationLinks();
                const header = rows.shift().split(',');
                const includedColumns = [0, 1, 2, 6, 7, 12, 14];
                const tableBody = document.getElementById('tableBody');
                tableBody.innerHTML = '';

                // Custom sorting function to sort based on ID column (index 0)
                const compareFunction = (rowA, rowB) => {
                    const idA = parseInt(rowA.split(',')[0]);
                    const idB = parseInt(rowB.split(',')[0]);
                    return idB - idA; // Sort in decreasing order
                };

                // Sort the rows based on ID column
                rows.sort(compareFunction);

                for (let i = startIndex; i < endIndex && i < rows.length; i++) {
                    const row = rows[i];
                    const columns = row.split(',');
                    const tr = document.createElement('tr');
                    const actionsTd = document.createElement('td');
                    actionsTd.innerHTML = '<button>Edit</button> <button>Delete</button>';
                    tr.appendChild(actionsTd);
                    includedColumns.forEach(index => {
                        const td = document.createElement('td');
                        const cellValue = columns[index] ? columns[index].replace(/"/g, '').trim() : '';
                        td.textContent = cellValue;
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                }

                // Call the search function after populating the data
                searchByQuery(rows);
            })
            .catch(error => console.error('Error fetching data:', error));
    }


    function generatePaginationLinks() {
        const pagination = document.querySelector('.pagination');
        pagination.innerHTML = ''; // Clear existing pagination links

        const maxVisiblePages = 3; // Maximum number of visible page links
        const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

        let startPage = currentPage - halfMaxVisiblePages;
        let endPage = currentPage + halfMaxVisiblePages;

        if (startPage < 1) {
            startPage = 1;
            endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
        }

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        const prevLink = document.createElement('a');
        prevLink.href = '#';
        prevLink.innerHTML = '«';
        pagination.appendChild(prevLink);

        if (startPage > 1) {
            const firstLink = document.createElement('a');
            firstLink.href = '#';
            firstLink.textContent = '1';
            pagination.appendChild(firstLink);

            if (startPage > 2) {
                pagination.appendChild(document.createTextNode('...'));
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = i;
            if (i === currentPage) {
                link.classList.add('active');
            }
            pagination.appendChild(link);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pagination.appendChild(document.createTextNode('...'));
            }
            const lastLink = document.createElement('a');
            lastLink.href = '#';
            lastLink.textContent = totalPages;
            pagination.appendChild(lastLink);
        }

        const nextLink = document.createElement('a');
        nextLink.href = '#';
        nextLink.innerHTML = '»';
        pagination.appendChild(nextLink);

        // Add event listener for pagination clicks after creating all links
        pagination.addEventListener('click', handlePaginationClick);
    }

    // Call the function to populate the table with the initial page when the page loads
    populateTable(currentPage);
    generatePaginationLinks();

    function handlePaginationClick(event) {
        event.preventDefault();
        const target = event.target;

        // Check if the clicked element is a pagination link
        if (target.tagName.toLowerCase() === 'a' && !target.classList.contains('active')) {
            if (target.innerHTML === '«') {
                // Update current page for previous button click
                currentPage = Math.max(currentPage - 1, 1);
            } else if (target.innerHTML === '»') {
                // Update current page for next button click
                currentPage = Math.min(currentPage + 1, totalPages);
            } else {
                // Get the page number from the link's text content
                currentPage = parseInt(target.textContent);
            }
            // Populate the table with data for the new page
            populateTable(currentPage);
            // Generate the pagination links for the new page
            generatePaginationLinks();
        }
    }

    // Add event listener for pagination clicks
    const pagination = document.querySelector('.pagination');
    pagination.addEventListener('click', handlePaginationClick);

    // Add event listener for header clicks to sort the table
    const tableHeaders = document.querySelectorAll('th[data-sortable="true"]');
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const columnIndex = Array.from(header.parentNode.children).indexOf(header);
            if (columnIndex !== sortColumnIndex) {
                // If a different column is clicked, reset sort direction to ascending
                sortDirection = 'asc';
            } else {
                // Toggle sort direction
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            }
            sortColumnIndex = columnIndex;
            // Repopulate table with sorted data
            populateTable(currentPage);
        });
    });
});
