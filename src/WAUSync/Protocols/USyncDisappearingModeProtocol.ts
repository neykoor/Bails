import { USyncQueryProtocol } from '../../Types/USync'
import { assertNodeErrorFree, BinaryNode } from '../../WABinary'

export type DisappearingModeData = {
	duration: number
	setAt?: Date
}

export class USyncDisappearingModeProtocol implements USyncQueryProtocol {
	name = 'disappearing_mode'

	getQueryElement(): BinaryNode {
		return {
			tag: 'disappearing_mode',
			attrs: {},
		}
	}

	getUserElement(): null {
		return null
	}

	parser(node: BinaryNode): DisappearingModeData | undefined {
		if (node.tag === 'status') {
			assertNodeErrorFree(node)

			const durationStr = node.attrs?.duration
			const timestampStr = node.attrs?.t

			const duration = durationStr ? Number(durationStr) : 0
			const setAt = timestampStr ? new Date(Number(timestampStr) * 1000) : undefined

			return {
				duration,
				setAt,
			}
		}

		return undefined
	}
}
