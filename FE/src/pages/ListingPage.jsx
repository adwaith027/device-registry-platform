import { useState } from 'react'
import Modal from '../components/Modal.jsx'
import CustomerForm from '../components/CustomerForm.jsx'
import '../styles/ListingPage.css'

export default function ListingPage() {
  // STATE: Store products list
  const [products, setProducts] = useState([
    { id: 1, productId: 'P001', name: 'Product One', uuid: '123e4567-e89b-12d3-a456-426614174000' },
    { id: 2, productId: 'P002', name: 'Product Two', uuid: '223e4567-e89b-12d3-a456-426614174001' },
    { id: 3, productId: 'P003', name: 'Product Three', uuid: '323e4567-e89b-12d3-a456-426614174002' }
  ])

  // STATE: Track which modal is open ('add', 'edit', or null)
  const [modalType, setModalType] = useState(null)

  // STATE: Track which product is being edited
  const [selectedProduct, setSelectedProduct] = useState(null)

  // FUNCTION: Open Add modal
  const openAddModal = () => {
    setModalType('add')
    setSelectedProduct(null)
  }

  // FUNCTION: Open Edit modal with selected product
  const openEditModal = (product) => {
    setModalType('edit')
    setSelectedProduct(product)
  }

  // FUNCTION: Close modal
  const closeModal = () => {
    setModalType(null)
    setSelectedProduct(null)
  }

  // HANDLER: Add new product
  const handleAddProduct = (formData) => {
    const newProduct = {
      id: Date.now(),
      productId: `P${String(products.length + 1).padStart(3, '0')}`,
      uuid: crypto.randomUUID(),
      ...formData
    }
    setProducts([...products, newProduct])
    closeModal()
  }

  // HANDLER: Update existing product
  const handleEditProduct = (formData) => {
    setProducts(products.map(product =>
      product.id === selectedProduct.id
        ? { ...product, ...formData }
        : product
    ))
    closeModal()
  }

  // HANDLER: Delete product with confirmation
  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId))
    }
  }

  return (
    <>
      <div className="listing-page">
        <div className="listing-page__container">

          {/* HEADER with Add New button */}
          <div className="listing-page__header">
            <h1 className="listing-page__title" >Enter Product Details</h1>
            <button 
              className="listing-page__add-btn" 
              onClick={openAddModal}
            >
              + Add New
            </button>
          </div>

          {/* TABLE - Wrapped for mobile scroll */}
          <div className="listing-page__table-wrapper">
            <table className="product-table">
              <thead className="product-table__head">
                <tr className="product-table__row">
                  <th className="product-table__header">Sl No</th>
                  <th className="product-table__header">Product ID</th>
                  <th className="product-table__header">Name</th>
                  <th className="product-table__header product-table__header--uuid">UUID</th>
                  <th className="product-table__header">Action</th>
                </tr>
              </thead>
              <tbody className="product-table__body">
                {products.map((product, index) => (
                  <tr key={product.id} className="product-table__row">
                    <td className="product-table__cell" data-label="Sl No">
                      {index + 1}
                    </td>
                    <td className="product-table__cell" data-label="Product ID">
                      {product.productId}
                    </td>
                    <td className="product-table__cell" data-label="Name">
                      {product.name}
                    </td>
                    <td 
                      className="product-table__cell product-table__cell--uuid" 
                      data-label="UUID"
                    >
                      {product.uuid}
                    </td>
                    <td className="product-table__cell" data-label="Action">
                      <div className="product-table__actions">
                        {/* EDIT button */}
                        <button
                          className="product-table__btn product-table__btn--edit"
                          onClick={() => openEditModal(product)}
                        >
                          Edit
                        </button>

                        {/* DELETE button */}
                        <button
                          className="product-table__btn product-table__btn--delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: Render based on modalType */}
      {modalType === 'add' && (
        <Modal onClose={closeModal} title="Add New Product">
          <CustomerForm
            onSubmit={handleAddProduct}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modalType === 'edit' && (
        <Modal onClose={closeModal} title="Edit Product">
          <CustomerForm
            initialData={selectedProduct}
            onSubmit={handleEditProduct}
            onCancel={closeModal}
            isEditMode={true}
          />
        </Modal>
      )}
    </>
  )
}