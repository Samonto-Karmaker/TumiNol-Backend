class PaginationResponseDTO {
    constructor(data, sizeOfData, totalPages, currentPage) {
        this.data = data;
        this.sizeOfData = sizeOfData;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }
}

export default PaginationResponseDTO;