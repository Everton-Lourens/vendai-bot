import { ModalLayout } from '../../../_ui/ModalLayout'
import style from './ModalCreateNewMessage.module.scss'
import { CustomTextField } from '../../../_ui/CustomTextField'
import { Checkbox, FormControlLabel, Popover, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { IMessage } from '../../../../models/interfaces/IMessage'
import { useFormMessage } from '../hooks/useFormMessage'

interface Props {
  messageDataToEdit: IMessage | null
  open: boolean
  handleClose: () => void
}

export function ModalCreateNewMessage({
  open,
  handleClose,
  messageDataToEdit,
}: Props) {
  const {
    onCreateNewMessage,
    onEditMessage,
    register,
    handleSubmit,
    setValue,
    errors,
    isSubmitting,
    isDefault,
    anchorEl,
    setAnchorEl,
  } = useFormMessage({
    handleClose,
    messageDataToEdit,
  })

  return (
    <ModalLayout
      open={open}
      handleClose={handleClose}
      onSubmit={handleSubmit(
        messageDataToEdit ? onEditMessage : onCreateNewMessage,
      )}
      title="Cadastro de mensagens"
      submitButtonText="Confirmar"
      loading={isSubmitting}
    >
      <div className={style.fieldsContainer}>
        <Typography
          sx={{
            p: 1,
            display: 'flex',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}
          className={style.popover}
        >
          Estágio: {messageDataToEdit ? messageDataToEdit?.stage + 1 : '--'}
        </Typography>
        <CustomTextField
          size="small"
          label="Texto *"
          type="text"
          placeholder="Digite o texto da mensagem"
          {...register('text', { required: true })}
          error={!!errors?.text}
          helperText={errors.text && errors?.text?.message}
        />

        <CustomTextField
          size="small"
          label="Posição *"
          type="number"
          placeholder="Posição dentro do estágio"
          {...register('position', { required: true, valueAsNumber: true })}
          error={!!errors.position}
          helperText={errors.position && errors?.position?.message}
        />

        <div className={style.labelDefaultMessage}>
          <FormControlLabel
            onChange={(event: any) => {
              setValue('isDefault', event.target.checked)
            }}
            control={
              <Checkbox
                checked={isDefault}
                sx={{
                  '&.Mui-checked': { color: '#ff6600' },
                }}
              />
            }
            label="Tornar esta mensagem padrão"
          />

          <FontAwesomeIcon
            icon={faInfoCircle}
            className={style.infoIcon}
            onClick={(event) => {
              setAnchorEl(event.currentTarget)
            }}
          />

          <Popover
            id="simple-popover"
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={() => {
              setAnchorEl(null)
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Typography sx={{ p: 2 }} className={style.popover}>
              Ao definir uma mensagem como padrão, ela será selecionado
              automaticamente como a primeira mensagem do Chatbot.
            </Typography>
          </Popover>
        </div>
      </div>
    </ModalLayout>
  )
}
