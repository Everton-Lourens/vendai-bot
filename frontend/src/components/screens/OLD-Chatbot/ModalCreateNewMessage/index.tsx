import { ModalLayout } from '../../../_ui/ModalLayout'
import style from './ModalCreateNewChatbot.module.scss'
import { CustomTextField } from '../../../_ui/CustomTextField'
import { Autocomplete, MenuItem } from '@mui/material'
import { paymentTypeList } from '../../../../models/constants/PaymentTypeList'
import { format } from '../../../../utils/format'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { IMessage } from '../../../../models/interfaces/IMessage'
import { useClientList } from '../../../../hooks/useClientList'
import { useFormMessage } from '../hooks/useFormMessage'
import { useProductList } from '../../../../hooks/useProductList'

interface Props {
  messageToEditData: IMessage | null
  open: boolean
  handleClose: () => void
}

export function ModalCreateNewMessage({
  open,
  handleClose,
  messageToEditData,
}: Props) {
  const { products: productsList } = useProductList()
  const { clients: clientsList } = useClientList()

  const {
    errors,
    handleSubmit,
    isSubmitting,
    onCreateNewMessage,
    onEditMessage,
    products,
    register,
    setValue,
    totalValue,
    handleAddNewProduct,
    handleChangeProduct,
    handleRemoveProduct,
  } = useFormMessage({
    handleClose,
    messageToEditData,
    productsList,
  })

  return (
    <ModalLayout
      open={open}
      handleClose={handleClose}
      onSubmit={handleSubmit(
        messageToEditData ? onEditMessage : onCreateNewMessage,
      )}
      title={messageToEditData ? 'Editar mensagem' : 'Criar nova mensagem'}
      submitButtonText={messageToEditData ? 'Atualizar' : 'Finalizar'}
      loading={isSubmitting}
    >
      <div className={style.content}>
        <section className={style.sectionContainer}>
          <h3>Informações da mensagem</h3>
          <div className={style.fieldsContainer}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={clientsList}
              noOptionsText="Nenhum cliente encontrado"
              loadingText="Buscando clientes..."
              onChange={(event, value) => {
                setValue('clientId', value?._id || null)
              }}
              getOptionLabel={(client) => client.name}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  size="small"
                  className={style.input}
                  label="Cliente"
                  type="text"
                  placeholder="Digite o nome do cliente"
                />
              )}
            />

            <CustomTextField
              size="small"
              className={style.input}
              label="Forma de pagamento *"
              select
              placeholder="Escolha a forma de pagamento"
              {...register('paymentType')}
              error={!!errors.paymentType}
              helperText={errors.paymentType && errors.paymentType.message}
            >
              {paymentTypeList.map(({ text, value }) => {
                return (
                  <MenuItem key={value} value={value}>
                    {text || '--'}
                  </MenuItem>
                )
              })}
            </CustomTextField>

            <CustomTextField
              size="small"
              className={style.input}
              label="Mensagens"
              select
              placeholder="Selecione uma mensagem"
              onChange={handleAddNewProduct}
            >
              {productsList.map(({ _id, name }) => {
                return (
                  <MenuItem key={_id} value={_id}>
                    {name || '--'}
                  </MenuItem>
                )
              })}
            </CustomTextField>
          </div>
        </section>
        <section className={style.sectionContainer}>
          <div className={style.headerProductsList}>
            <h3>Mensagens</h3>
            {products.length > 0 && (
              <span>{format.formatToReal(totalValue || 0)}</span>
            )}
          </div>
          {products.length > 0 ? (
            <ul className={style.listProducts}>
              {products.map((product, index) => {
                return (
                  <li key={product?._id}>
                    <span>{product?.name}</span>
                    <CustomTextField
                      className={style.inputProduct}
                      label="Quantidade"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={product?.amount}
                      name="amount"
                      type="number"
                      onChange={(event) => {
                        handleChangeProduct(event, index)
                      }}
                    />
                    <CustomTextField
                      className={style.inputProduct}
                      label="Valor"
                      type="number"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={product?.value}
                      name="value"
                      onChange={(event) => {
                        handleChangeProduct(event, index)
                      }}
                    />

                    <FontAwesomeIcon
                      onClick={() => {
                        handleRemoveProduct(product?._id)
                      }}
                      className={style.removeProductIcon}
                      icon={faTrash}
                    />
                  </li>
                )
              })}
            </ul>
          ) : (
            <div>
              <span>Nenhuma mensagem selecionada</span>
            </div>
          )}
        </section>
      </div>
    </ModalLayout>
  )
}
