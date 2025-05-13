import { MockAccountsRepository } from './../../../repositories/Accounts/MockAccountsRepository'
import { CreateNewAccountService } from '../CreateNewAccount/CreateNewAccountService.service'
import { Types } from 'mongoose'
import { UpdateAccountService } from './UpdateAccountService.service'
import { AppError } from '../../../errors/AppError'

let mockAccountsRepository: MockAccountsRepository

let createNewAccountService: CreateNewAccountService
let updateAccountService: UpdateAccountService

describe('Update account infos', () => {
  beforeEach(() => {
    mockAccountsRepository = new MockAccountsRepository()

    createNewAccountService = new CreateNewAccountService(
      mockAccountsRepository,
    )
    updateAccountService = new UpdateAccountService(mockAccountsRepository)
  })

  it('should be able update account infos', async () => {
    const newAccount = await createNewAccountService.execute({
      type: 'in',
      userId: new Types.ObjectId().toString(),
      category: 'Despesas do estabelecimento',
      value: 99,
      description: 'Conta de luz',
    })

    const newValues = {
      category: 'Nova categoria',
      description: 'Nova descrição',
      status: 'overdue',
      type: 'out',
      value: 1,
    }

    await updateAccountService.execute({
      idAccount: newAccount._id.toString(),
      ...newValues,
    })

    const updatedAccount = await mockAccountsRepository.findById(
      newAccount._id.toString(),
    )

    Object.keys(newValues).forEach((key) => {
      expect(updatedAccount[key]).toEqual(newValues[key])
    })
  })

  it('should not be able update account if idAccount no sent', async () => {
    await expect(async () => {
      await createNewAccountService.execute({
        type: 'in',
        userId: new Types.ObjectId().toString(),
        category: 'Despesas do estabelecimento',
        value: 99,
        description: 'Conta de luz',
      })

      const newValues = {
        category: 'Nova categoria',
        description: 'Nova descrição',
        status: 'overdue',
        type: 'out',
        value: 1,
      }

      await updateAccountService.execute({
        idAccount: undefined,
        ...newValues,
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able update account if idAccount is from a non-existent account', async () => {
    await expect(async () => {
      await createNewAccountService.execute({
        type: 'in',
        userId: new Types.ObjectId().toString(),
        category: 'Despesas do estabelecimento',
        value: 99,
        description: 'Conta de luz',
      })

      const newValues = {
        category: 'Nova categoria',
        description: 'Nova descrição',
        status: 'overdue',
        type: 'out',
        value: 1,
      }

      await updateAccountService.execute({
        idAccount: new Types.ObjectId().toString(),
        ...newValues,
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
