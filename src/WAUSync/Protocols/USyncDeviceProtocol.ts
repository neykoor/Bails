import { USyncQueryProtocol } from '../../Types/USync'
import { assertNodeErrorFree, BinaryNode, getBinaryNodeChild } from '../../WABinary'

export type KeyIndexData = {
	timestamp: number
	signedKeyIndex?: Uint8Array
	expectedTimestamp?: number
}

export type DeviceListData = {
	id: number
	keyIndex?: number
	isHosted?: boolean
}

export type ParsedDeviceInfo = {
	deviceList?: DeviceListData[]
	keyIndex?: KeyIndexData
}

export class USyncDeviceProtocol implements USyncQueryProtocol {
	name = 'devices'

	getQueryElement(): BinaryNode {
		return {
			tag: 'devices',
			attrs: {
				version: '2',
			},
		}
	}

	getUserElement(): BinaryNode | null {
		// TODO: Implement device phashing, ts and expectedTs logic
		return null
	}

	parser(node: BinaryNode): ParsedDeviceInfo {
		const deviceList: DeviceListData[] = []
		let keyIndex: KeyIndexData | undefined

		if (node.tag === 'devices') {
			assertNodeErrorFree(node)

			const deviceListNode = getBinaryNodeChild(node, 'device-list')
			const keyIndexNode = getBinaryNodeChild(node, 'key-index-list')

			// Parse device list
			if (Array.isArray(deviceListNode?.content)) {
				for (const item of deviceListNode.content) {
					if (item.tag === 'device') {
						const id = Number(item.attrs?.id)
						const keyIndex = item.attrs?.['key-index'] !== undefined ? Number(item.attrs['key-index']) : undefined
						const isHosted = item.attrs?.['is_hosted'] === 'true'

						if (!Number.isNaN(id)) {
							deviceList.push({
								id,
								keyIndex,
								isHosted
							})
						}
					}
				}
			}

			// Parse key index
			if (keyIndexNode?.tag === 'key-index-list') {
				const timestamp = Number(keyIndexNode.attrs['ts'])
				const expectedTimestamp = keyIndexNode.attrs['expected_ts'] ? Number(keyIndexNode.attrs['expected_ts']) : undefined
				const signedKeyIndex = keyIndexNode.content instanceof Uint8Array ? keyIndexNode.content : undefined

				if (!Number.isNaN(timestamp)) {
					keyIndex = {
						timestamp,
						signedKeyIndex,
						expectedTimestamp
					}
				}
			}
		}

		return {
			deviceList: deviceList.length ? deviceList : undefined,
			keyIndex
		}
	}
}
