import { WaConnectionStatus } from '@/models/enums/WaConnectionStatus'
import { WaStatusList } from '../constants/WaStatusList'

export function formatConnectionStatus(status: WaConnectionStatus | null) {
  if (!status) return '--'

  const statusFormated = WaStatusList.find(
    (statusItem) => statusItem.value === status,
  )

  return statusFormated?.text || '--'
}
