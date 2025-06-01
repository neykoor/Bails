import { USyncQueryProtocol } from '../../Types/USync'
import { assertNodeErrorFree, BinaryNode } from '../../WABinary'

export type StatusData = {
	status: string | null
	setAt: Date
}

export class USyncStatusProtocol implements USyncQueryProtocol {
	name = 'status'

	getQueryElement(): BinaryNode {
		return {
			tag: 'status',
			attrs: {},
		}
	}

	getUserElement(): null {
		return null
	}

	parser(node: BinaryNode): StatusData | null {
		if (node.tag !== 'status') return null

		assertNodeErrorFree(node)

		const rawStatus = node?.content?.toString() ?? ''
		const statusCode = Number(node.attrs?.code)
		const status = rawStatus || (statusCode === 401 ? '' : null)
		const setAt = new Date(Number(node.attrs?.t || 0) * 1000)

		return {
			status,
			setAt,
		}
	}
}
