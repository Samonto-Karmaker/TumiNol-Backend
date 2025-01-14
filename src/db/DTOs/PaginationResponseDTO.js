class PaginationResponseDTO {
	constructor(data, totalItems, totalPages, currentPage) {
		this.data = data
		this.totalItems = totalItems
		this.totalPages = totalPages
		this.currentPage = currentPage
	}
}

export default PaginationResponseDTO
