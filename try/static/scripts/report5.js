// Global variables
let initialData = []; // Store initial table data
let filteredData = []; // Store filtered data
let fetchFilteredDataTimer = null;

let currentPage = 1;
const rowsPerPage = 10;
const maxVisiblePages = 1;

function clearForm() {
    document.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], select').forEach((input) => {
        input.value = '';
    });
}
function displayCSVData(csvData) {
    const tableBody = document.querySelector('#crimeReportTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Parse CSV data
    Papa.parse(csvData, {
        header: true, // Treat the first row as header
        complete: function(results) {
            // Manually parse the ID field as an integer
            initialData = results.data.map(row => ({
                ...row,
                ID: parseInt(row['ID']) // Parse ID as integer
            })) || []; // Store initial data

            // Sort rows based on the "ID" column in ascending order
            initialData.sort((a, b) => a['ID'] - b['ID']);

            // Display rows based on current page
            updateTableRows();

            // Generate pagination buttons after displaying initial data
            generatePaginationButtons();
        }
    });
}

// Function to create an icon element
function createSVGIcon(svgCode, alt) {
    const icon = document.createElement('img');
    // Convert SVG code to data URL
    const svgDataURL = 'data:image/svg+xml;base64,' + btoa(svgCode);
    icon.src = svgDataURL;
    icon.alt = alt;
    return icon;
}
// // Function to open modal
// function openModal(rowData) {
//     const modal = document.getElementById('myModal');
//     const modalContent = modal.querySelector('.modal-content');

//     // Clear existing content
//     modalContent.innerHTML = '';

//     // Populate modal with crime details
//     for (const [key, value] of Object.entries(rowData)) {
//         modalContent.innerHTML += `<p><strong>${key}:</strong> ${value}</p>`;
//     }

//     // Show modal
//     modal.style.display = 'block';
// }

// // Function to close modal
// function closeModal() {
//     const modal = document.getElementById('myModal');
//     modal.style.display = 'none';
// }

// Function to create a table row
function createRow(rowData) {
    if (!rowData['ID']) {
        return null; // Skip rows without ID
    }

    const newRow = document.createElement('tr');

    // Create cell for action icons
    const actionCell = document.createElement('td');
    actionCell.className = 'action-icons';

    // SVG code for the icons
    const eyeSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
        </svg>
    `;
    
    const editSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>
    `;

    const deleteSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>
    `;

    // Create view icon
    const viewIcon = createSVGIcon(eyeSVG, 'View');
    viewIcon.onclick = () => openPopup(rowData, false); // Attach click event for view
    actionCell.appendChild(viewIcon);

    // Create edit icon
    const editIcon = createSVGIcon(editSVG, 'Edit');
    editIcon.onclick = () => openPopup(rowData, true); // Attach click event for edit
    actionCell.appendChild(editIcon);

    // Create delete icon
    const deleteIcon = createSVGIcon(deleteSVG, 'Delete');
    deleteIcon.onclick = () => deleteRow(rowData); // Attach click event for delete
    actionCell.appendChild(deleteIcon);
    const paddedID = String(rowData['ID']).padStart(4, '0');

    // Add other data cells
    newRow.innerHTML = `
        <td>${rowData['ID']}</td>
        <td>${rowData['BARANGAY']}</td>
        <td>${rowData['DATE COMMITTED']}</td>
        <td>${rowData['TIME COMMITTED']}</td>
        <td>${rowData['OFFENSE']}</td>
        <td>${rowData['VICTIMS COUNT']}</td>
        <td>${rowData['VEHICLE KIND']}</td>
    `;

    newRow.insertBefore(actionCell, newRow.firstChild); // Insert action cell at the beginning

    return newRow;
}
function deleteRow(rowData) {
    const idToDelete = rowData['ID'];

    // Show confirmation dialog
    const confirmation = confirm("Are you sure you want to delete this data?");

    if (confirmation) {
        fetch('/delete_row', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: idToDelete }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); // Log success message

            // Remove the row from the initialData array in JavaScript
            const indexToDelete = initialData.findIndex(row => row['ID'] === idToDelete);
            if (indexToDelete !== -1) {
                initialData.splice(indexToDelete, 1);

                // Update filteredData if applicable
                if (filteredData.length > 0) {
                    const filteredIndexToDelete = filteredData.findIndex(row => row['ID'] === idToDelete);
                    if (filteredIndexToDelete !== -1) {
                        filteredData.splice(filteredIndexToDelete, 1);
                    }
                }

                // Update the table rows and pagination after deletion
                if (filteredData.length > 0) {
                    updateTableRowsFiltered(); // Update table rows with filtered data
                } else {
                    updateTableRows(); // Update table rows with initial data
                }
                generatePaginationButtons(); // Regenerate pagination buttons
            }

        })
        .catch(error => console.error('Error deleting row:', error));
    } else {
        console.log('Deletion cancelled by user.');
    }
}



// Function to save edited data
function saveEditedData(rowData) {
    const form = document.querySelector('form');
    const formData = new FormData(form);

    // Convert formData to JSON object
    const editedData = {};
    formData.forEach((value, key) => {
        editedData[key] = value;
    });

    // Send edited data to server
    fetch('/edit_row', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: rowData['ID'], newData: editedData }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Log success message

        // Update the row in the initialData array in JavaScript
        const indexToUpdate = initialData.findIndex(row => row['ID'] === rowData['ID']);
        if (indexToUpdate !== -1) {
            initialData[indexToUpdate] = { ...rowData, ...editedData };

            // Update filteredData if applicable
            if (filteredData.length > 0) {
                const filteredIndexToUpdate = filteredData.findIndex(row => row['ID'] === rowData['ID']);
                if (filteredIndexToUpdate !== -1) {
                    filteredData[filteredIndexToUpdate] = { ...rowData, ...editedData };
                }
            }

            // Update the table rows and pagination after editing
            if (filteredData.length > 0) {
                updateTableRowsFiltered(); // Update table rows with filtered data
            } else {
                updateTableRows(); // Update table rows with initial data
            }
            generatePaginationButtons(); // Regenerate pagination buttons
        }
    })
    .catch(error => console.error('Error editing row:', error));
}


// Function to search data by Date Range
function searchByDateRange() {
    const startDateString = document.getElementById('startDate').value;
    const endDateString = document.getElementById('endDate').value;

    if (startDateString === '' || endDateString === '') {
        displayPopupMessage('Please select both start and end dates.');
        return;
    }

    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (startDate > endDate) {
        displayPopupMessage('End date should be after the start date.');
        return;
    }

    filteredData = initialData.filter(row => {
        const dateCommitted = new Date(row['DATE COMMITTED']);
        return dateCommitted >= startDate && dateCommitted <= endDate;
    });

    currentPage = 1; // Reset to first page after filtering
    updateTableRowsFiltered(); // Update table rows with filtered data
    generatePaginationButtons(); // Regenerate pagination buttons based on filtered data
}

// Update table rows based on filtered data and pagination
function updateTableRowsFiltered() {
    const tableBody = document.querySelector('#crimeReportTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows


    filteredData.forEach(rowData => {
        const newRow = createRow(rowData);
        if (newRow) {
            tableBody.appendChild(newRow);
        }
    });
}

// Update table heading based on the applied filter
function updateTableHeading(startDate, endDate) {
    const heading = document.querySelector('.crime-container h2');
    heading.textContent = `Crime Report Data (${startDate} to ${endDate})`;
}


  // Function to download CSV data based on filtered date range
    function downloadCSV() {
        const startDateString = document.getElementById('startDate').value;
        const endDateString = document.getElementById('endDate').value;

        if (startDateString === '' || endDateString === '') {
            displayPopupMessage('Please select both start and end dates.');
            return;
        }

        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        if (startDate > endDate) {
            displayPopupMessage('End date should be after the start date.');
            return;
        }

        const filteredRows = initialData.filter(row => {
            const dateCommitted = new Date(row['DATE COMMITTED']);
            return dateCommitted >= startDate && dateCommitted <= endDate;
        });

        if (filteredRows.length === 0) {
            displayPopupMessage('No data available for the selected date range.');
            return;
        }

        const csvContent = Papa.unparse(filteredRows, {
            quotes: true, // Add quotes to values
            delimiter: ',', // CSV delimiter
            header: true // Include header row
        });

        // Create a Blob object for the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Create a temporary anchor element to trigger the download
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.download = 'roadAccidentData.csv';
        anchor.click();

        // Cleanup
        URL.revokeObjectURL(anchor.href);
    }




// // Global variable to store the selected row data
// let selectedRowData = null;

// function openPopup(rowData, isEdit) {
//     selectedRowData = rowData;

//     const popupContent = document.getElementById('popupContent');
//     popupContent.innerHTML = ''; // Clear existing content

//     const form = document.createElement('form');
//     form.addEventListener('submit', (event) => {
//         event.preventDefault(); // Prevent form submission
//         if (isEdit) {
//             saveEditedData(rowData); // Call function to save edited data
//         } else {
//             // Handle other form submissions if needed
//         }
//         closePopup(); // Close popup after saving
//     });

//     const detailsList = document.createElement('ul');
//     detailsList.classList.add('popup-columns'); // Add a class for styling columns

//     // Add ID as a non-editable field
//     const idListItem = document.createElement('li');
//     const idInputField = document.createElement('input');
//     idInputField.type = 'number'; // Set data type to number (integer)
//     idInputField.name = 'ID';
//     idInputField.value = rowData['ID']; // Set initial value from rowData
//     idInputField.readOnly = true; // Make it read-only
//     idListItem.innerHTML = `<strong>ID:</strong>`;
//     idListItem.appendChild(idInputField);
//     detailsList.appendChild(idListItem);

//     // Add Date Committed as a date input only in edit mode
//     if (isEdit) {
//         const dateCommittedListItem = document.createElement('li');
//         const dateCommittedLabel = document.createElement('strong');
//         dateCommittedLabel.textContent = 'Date Committed:';
//         dateCommittedListItem.appendChild(dateCommittedLabel);

//         const dateInput = document.createElement('input');
//         dateInput.type = 'date'; // Set data type to date
//         dateInput.name = 'DATE_COMMITTED'; // Use key as the input field name
//         dateInput.value = rowData['DATE_COMMITTED']; // Set initial value from rowData
//         dateCommittedListItem.appendChild(dateInput);

//         detailsList.appendChild(dateCommittedListItem);
//     }

//     // Add Time Committed (HH:MM:SS) input field
//     if (isEdit) {
//         const timeListItem = document.createElement('li');
//         timeListItem.innerHTML = '<strong>Time Committed (HH:MM:SS):</strong>';

//         const timeInputField = document.createElement('input');
//         timeInputField.type = 'text'; // Set data type to text
//         timeInputField.name = 'TIME_COMMITTED'; // Use key as the input field name
//         timeInputField.value = rowData['TIME COMMITTED']; // Set initial value from rowData

//         // Add event listener for input events to validate time format
//         timeInputField.addEventListener('input', (event) => {
//             let inputValue = event.target.value;

//             // Validate time format (HH:MM:SS)
//             const timeParts = inputValue.split(':');
//             let isValidTime = true;

//             if (timeParts.length !== 3) {
//                 isValidTime = false;
//             } else {
//                 const hours = parseInt(timeParts[0], 10);
//                 const minutes = parseInt(timeParts[1], 10);
//                 const seconds = parseInt(timeParts[2], 10);

//                 if (isNaN(hours) || hours < 0 || hours > 23 ||
//                     isNaN(minutes) || minutes < 0 || minutes > 59 ||
//                     isNaN(seconds) || seconds < 0 || seconds > 59) {
//                     isValidTime = false;
//                 }
//             }

//             if (!isValidTime) {
//                 event.target.setCustomValidity('Invalid time format. Use HH:MM:SS');
//             } else {
//                 event.target.setCustomValidity('');
//             }

//             // Update the input value
//             event.target.value = inputValue;
//         });

//         timeInputField.addEventListener('blur', (event) => {
//             const inputValue = event.target.value.trim();
//             if (inputValue.length === 0) {
//                 event.target.value = ''; // Clear invalid value
//                 event.target.setCustomValidity('Time input is required.');
//             }
//         });

//         timeListItem.appendChild(timeInputField);
//         detailsList.appendChild(timeListItem);
//     }

//     // Add Barangay dropdown only in edit mode
//     if (isEdit) {
//         const barangayListItem = document.createElement('li');
//         const barangayLabel = document.createElement('strong');
//         barangayLabel.textContent = 'Barangay:';
//         barangayListItem.appendChild(barangayLabel);

//         const barangaySelect = document.createElement('select');
//         barangaySelect.name = 'BARANGAY'; // Use key as the input field name
//         // Add options to the dropdown
//         const barangayOptions = [
//             'Anonas', 'Bayaoas', 'Bactad East', 'Bolaoen', 'Cabaruan', 'Camantiles', 'Camanang', 'Catablan',
//             'Cayambanan', 'Consolacion', 'Dilan Paurido', 'Dr. Pedro T. Orata (Bactad Proper)', 'Labit Proper',
//             'Macalong', 'Mabanogbog', 'Nancalobasaan', 'Nancamaliran East', 'Nancamaliran West', 'Nancayasan',
//             'Palina East', 'Palina West', 'Pinmaludpod', 'Poblacion', 'San Jose', 'San Vicente', 'Santa Lucia',
//             'Santo Domingo', 'Tulong'
//         ];
//         barangayOptions.forEach(optionValue => {
//             const option = document.createElement('option');
//             option.value = optionValue;
//             option.textContent = optionValue;
//             // Check if this option is selected
//             if (rowData['BARANGAY'] === optionValue) {
//                 option.selected = true;
//             }
//             barangaySelect.appendChild(option);
//         });

//         barangayListItem.appendChild(barangaySelect);
//         detailsList.appendChild(barangayListItem);
//     }

//     // Add other editable fields with appropriate data types and validation
//     Object.entries(rowData).forEach(([key, value]) => {
//         // Exclude fields not to be edited and those already handled above
//         if (
//             key !== 'ID' &&
//             key !== 'YEAR COMMITTED' &&
//             key !== 'MONTH COMMITTED' &&
//             key !== 'DAY COMMITTED' &&
//             key !== 'TIME COMMITTED' &&
//             key !== 'DATE_COMMITTED' && // Exclude Date Committed from editable fields
//             (!isEdit || key !== 'BARANGAY')
//         ) {
//             const listItem = document.createElement('li');
//             const inputField = document.createElement('input');
//             inputField.classList.add('form-input');
//             inputField.name = key; // Use key as the input field name
//             inputField.value = value; // Set initial value from rowData

//             switch (key) {
//                 case 'VICTIMS Age':
//                 case 'SUSPECTS Age':
//                 case 'VICTIMS COUNT':
//                 case 'SUSPECTS COUNT':
//                 case 'WIND_SPEED':
//                 case 'WIND_DIRECTION':
//                 case 'LONGITUDE':
//                 case 'LATITUDE':
//                 case 'RAINFALL':
//                 case 'TMAX':
//                 case 'TMIN':
//                     inputField.type = 'number'; // Set data type to number (decimal)
//                     inputField.step = 'any'; // Allow any decimal step
//                     inputField.addEventListener('input', () => {
//                         if (isNaN(inputField.valueAsNumber)) {
//                             inputField.setCustomValidity('Invalid Input');
//                         } else {
//                             inputField.setCustomValidity('');
//                         }
//                     });
//                     break;
//                 case 'BARANGAY':
//                 case 'OFFENSE':
//                 case 'VICTIMS Gender':
//                 case 'SUSPECTS Gender':
//                 case 'VEHICLE KIND':
//                     inputField.type = 'text'; // Set data type to text
//                     break;
//                 default:
//                     inputField.type = 'text'; // Default to text type
//                     break;
//             }

//             if (!isEdit) {
//                 inputField.disabled = true; // Disable input fields for view mode
//             }

//             listItem.innerHTML = `<strong>${key}:</strong>`;
//             listItem.appendChild(inputField);
//             detailsList.appendChild(listItem);
//         }
//     });

//     form.appendChild(detailsList);

//     // Create buttons for save and cancel if in edit mode
//     if (isEdit) {
//         const saveButton = document.createElement('button');
//         saveButton.textContent = 'Save';
//         saveButton.type = 'submit'; // Trigger form submission
//         form.appendChild(saveButton);

//         const cancelButton = document.createElement('button');
//         cancelButton.textContent = 'Cancel';
//         cancelButton.type = 'button'; // Prevent form submission
//         cancelButton.onclick = closePopup; // Attach click event for cancel
//         form.appendChild(cancelButton);
//     }

//     popupContent.appendChild(form);

//     const overlay = document.getElementById('overlay');
//     const popup = document.getElementById('viewPopup');
//     overlay.style.display = 'block';
//     overlay.style.opacity = 1;
//     popup.style.display = 'block';
//     setTimeout(() => {
//         popup.style.opacity = 1;
//     }, 50); // Delay opacity transition for smoother effect
// }

// function resetFormValues(form) {
//     // Iterate through form elements and reset values if unchanged or empty
//     form.querySelectorAll('input, select').forEach((element) => {
//         const defaultValue = element.getAttribute('data-default-value');
//         if (defaultValue !== null && (element.value.trim() === '' || element.value === defaultValue)) {
//             element.value = defaultValue;
//         }
//     });
// }


//  function closePopup() {
//         selectedRowData = null;

//         const overlay = document.getElementById('overlay');
//         const popup = document.getElementById('viewPopup');
//         overlay.style.opacity = 0;
//         popup.style.opacity = 0;
//         setTimeout(() => {
//             overlay.style.display = 'none';
//             popup.style.display = 'none';
//         }, 300); // Wait for transition to complete
//     }

// Update table rows based on initial data and pagination
function updateTableRows() {
    const tableBody = document.querySelector('#crimeReportTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const dataToShow = initialData.slice(startIndex, endIndex);

    dataToShow.forEach(rowData => {
        const newRow = createRow(rowData);
        if (newRow) {
            tableBody.appendChild(newRow);
        }
    });
}

function generatePaginationButtons() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear existing pagination

    const dataToPaginate = filteredData.length > 0 ? filteredData : initialData; // Use filtered data if available

    const totalPages = Math.ceil(dataToPaginate.length / rowsPerPage);

    if (totalPages <= maxVisiblePages) {
        // If total pages are less than or equal to maxVisiblePages, show all pages
        for (let i = 1; i <= totalPages; i++) {
            addPaginationButton(paginationContainer, i);
        }
    } else {
        let startPage, endPage;
        if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
            startPage = 1;
            endPage = maxVisiblePages;
        } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
            startPage = totalPages - maxVisiblePages + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - Math.floor(maxVisiblePages / 2);
            endPage = currentPage + Math.floor(maxVisiblePages / 2);
        }

        if (startPage < 1) {
            startPage = 1;
        }
        if (endPage > totalPages) {
            endPage = totalPages;
        }

        if (startPage > 1) {
            addPaginationButton(paginationContainer, 1); // Always show first page
            if (startPage > 2) {
                paginationContainer.appendChild(createEllipsis());
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            addPaginationButton(paginationContainer, i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationContainer.appendChild(createEllipsis());
            }
            addPaginationButton(paginationContainer, totalPages); // Always show last page
        }
    }

    const prevButton = document.createElement('button');
    prevButton.textContent = '«';
    prevButton.onclick = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };
    if (currentPage === 1) {
        prevButton.disabled = true;
    }
    paginationContainer.insertBefore(prevButton, paginationContainer.firstChild);

    const nextButton = document.createElement('button');
    nextButton.textContent = '»';
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };
    if (currentPage === totalPages) {
        nextButton.disabled = true;
    }
    paginationContainer.appendChild(nextButton);

    highlightActivePage(currentPage);
}


function addPaginationButton(container, pageNumber) {
    const button = document.createElement('button');
    button.textContent = pageNumber;
    button.onclick = () => goToPage(pageNumber);
    if (pageNumber === currentPage) {
        button.classList.add('active');
    }
    container.appendChild(button);
}

function createEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.classList.add('ellipsis');
    return ellipsis;
}

// Navigate to a specific page
function goToPage(pageNumber) {
    currentPage = pageNumber;
    if (filteredData.length > 0) {
        updateTableRowsFiltered(); // Update table rows with filtered data
    } else {
        updateTableRows(); // Update table rows with initial data
    }
    generatePaginationButtons(); // Regenerate pagination buttons
}


// Highlight active page in pagination
function highlightActivePage(pageNumber) {
    const paginationButtons = document.querySelectorAll('.pagination button');
    paginationButtons.forEach(button => {
        button.classList.remove('active');
        if (parseInt(button.textContent) === pageNumber) {
            button.classList.add('active');
        }
    });
}

// Function to fetch CSV data from the server and display initially
function fetchCSVDataAndDisplay() {
    fetch('/get_csv_data')
        .then(response => response.text())
        .then(data => {
            Papa.parse(data, {
                header: true,
                complete: function(results) {
                    initialData = results.data || [];
                    initialData.sort((a, b) => parseInt(a['Year Committed']) - parseInt(b['Year Committed']));
                    initialData.reverse();
                    updateTableRows(); // Update table initially
                    generatePaginationButtons();
                }
            });
        })
        .catch(error => console.error('Error fetching CSV data:', error));
}


// Function to fetch and display filtered data periodically
function fetchAndDisplayFilteredData() {
    searchByBarangay(); // Perform initial search

    // Clear any existing timer to avoid multiple timers running simultaneously
    if (fetchFilteredDataTimer) {
        clearInterval(fetchFilteredDataTimer);
    }
}


// Function to display a pop-up message
function displayPopupMessage(message) {
    alert(message); // You can replace this with your custom pop-up or use a library for more styling
}


// Function to search data by Barangay
function searchByBarangay() {
    const selectedBarangay = document.getElementById('barangayDropdown').value;
    if (selectedBarangay === '') {
        displayPopupMessage('Choose a Barangay to search first');
    } else {
        filteredData = initialData.filter(row => row['BARANGAY'] === selectedBarangay);
        currentPage = 1; // Reset to first page after filtering
        updateTableRowsFiltered(); // Update table rows with filtered data
        generatePaginationButtons(); // Regenerate pagination buttons based on filtered data
    }
}


// Update table rows based on filtered data and pagination
function updateTableRowsFiltered() {
    const tableBody = document.querySelector('#crimeReportTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const dataToShow = filteredData.slice(startIndex, endIndex);

    dataToShow.forEach(rowData => {
        const newRow = createRow(rowData);
        if (newRow) {
            tableBody.appendChild(newRow);
        }
    });
}


function clearAllFields() {
    // Clear input fields
    document.getElementById('barangayDropdown').selectedIndex = 0;
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';

    // Reload the page
    location.reload();
}
function openPopup(rowData) {
    const id = rowData['ID'];
    const location = rowData['BARANGAY'];
    const crimeType = rowData['OFFENSE'];
    const date = rowData['DATE COMMITTED'];
    const time = rowData['TIME COMMITTED'];
    const victimAge = rowData['VICTIMS Age'];
    const victimGender = rowData['VICTIMS Gender'];
    const suspectAge = rowData['SUSPECTS Age'];
    const suspectGender = rowData['SUSPECTS Gender'];
    const victimCount = rowData['VICTIMS COUNT'];
    const suspectCount = rowData['SUSPECTS COUNT'];
    const vehicleKind = rowData['VEHICLE KIND'];
    const longitude = rowData['LONGITUDE'];
    const latitude = rowData['LATITUDE'];
    const rainfall = rowData['RAINFALL'];
    const tmax = rowData['TMAX'];
    const tmin = rowData['TMIN'];
    const windSpeed = rowData['WIND_SPEED'];
    const windDirection = rowData['WIND_DIRECTION'];

    document.getElementById('idPop').value = id;
    document.getElementById('locationPop').value = location;
    document.getElementById('crimeTypePop').value = crimeType;
    document.getElementById('datePop').value = date;
    document.getElementById('timePop').value = time;
    document.getElementById('victimAgePop').value = victimAge;
    document.getElementById('victimGenderPop').value = victimGender;
    document.getElementById('suspectAgePop').value = suspectAge;
    document.getElementById('suspectGenderPop').value = suspectGender;
    document.getElementById('victimCountPop').value = victimCount;
    document.getElementById('suspectCountPop').value = suspectCount;
    document.getElementById('vehicleKindPop').value = vehicleKind;
    document.getElementById('longitudePop').value = longitude;
    document.getElementById('latitudePop').value = latitude;
    document.getElementById('rainfallPop').value = rainfall;
    document.getElementById('tmaxPop').value = tmax;
    document.getElementById('tminPop').value = tmin;
    document.getElementById('windSpeedPop').value = windSpeed;
    document.getElementById('windDirectionPop').value = windDirection;

    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('viewPopup');
    overlay.style.display = 'block';
    popup.style.display = 'block';
}

// function openPopup(rowData) {
//     const id = rowData['ID'];
//     const location = rowData['BARANGAY'];
//     const crimeType = rowData['OFFENSE'];
//     const date = rowData['DATE COMMITTED'];
//     const time = rowData['TIME COMMITTED'];
//     const victimAge = rowData['VICTIMS Age'];
//     const victimGender = rowData['VICTIMS Gender'];
//     const suspectAge = rowData['SUSPECTS Age'];
//     const suspectGender = rowData['SUSPECTS Gender'];
//     const victimCount = rowData['VICTIMS COUNT'];
//     const suspectCount = rowData['SUSPECTS COUNT'];
//     const vehicleKind = rowData['VEHICLE KIND'];
//     const longitude = rowData['LONGITUDE'];
//     const latitude = rowData['LATITUDE'];
//     const rainfall = rowData['RAINFALL'];
//     const tmax = rowData['TMAX'];
//     const tmin = rowData['TMIN'];
//     const windSpeed = rowData['WIND_SPEED'];
//     const windDirection = rowData['WIND_DIRECTION'];
    

//     document.getElementById('idPop').textContent = id;
//     document.getElementById('locationPop').textContent = location;
//     document.getElementById('crimeTypePop').textContent = crimeType;
//     document.getElementById('datePop').textContent = date;
//     document.getElementById('timePop').textContent = time;
//     document.getElementById('victimAgePop').textContent = victimAge;
//     document.getElementById('victimGenderPop').textContent = victimGender;
//     document.getElementById('suspectAgePop').textContent = suspectAge;
//     document.getElementById('suspectGenderPop').textContent = suspectGender;
//     document.getElementById('victimCountPop').textContent = victimCount;
//     document.getElementById('suspectCountPop').textContent = suspectCount;
//     document.getElementById('vehicleKindPop').textContent = vehicleKind;
//     document.getElementById('longitudePop').textContent = longitude;
//     document.getElementById('latitudePop').textContent = latitude;
//     document.getElementById('rainfallPop').textContent = rainfall;
//     document.getElementById('tmaxPop').textContent = tmax;
//     document.getElementById('tminPop').textContent = tmin;
//     document.getElementById('windSpeedPop').textContent = windSpeed;
//     document.getElementById('windDirectionPop').textContent = windDirection;

//     const overlay = document.getElementById('overlay');
//     const popup = document.getElementById('viewPopup');
//     overlay.style.display = 'block';
//     popup.style.display = 'block';
// }

function closePopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('viewPopup');
    overlay.style.display = 'none';
    popup.style.display = 'none';
}
// Fetch CSV data from the server and display initially
fetchCSVDataAndDisplay();
