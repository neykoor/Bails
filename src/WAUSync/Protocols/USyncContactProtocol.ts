import { USyncQueryProtocol } from '../../Types/USync'
import { assertNodeErrorFree, BinaryNode } from '../../WABinary'
import { USyncUser } from '../USyncUser'

export class USyncContactProtocol implements USyncQueryProtocol {
	name = 'contact'

	getQueryElement(): BinaryNode {
		return {
			tag: 'contact',
			attrs: {},
		}
	}

	getUserElement(user: USyncUser): BinaryNode {
		// TODO: Implement type / username fields (not yet supported)
		const phone = typeof user.phone === 'string' ? user.phone : String(user.phone)

		return {
			tag: 'contact',
			attrs: {},
			content: phone,
		}
	}

	parser(node: BinaryNode): boolean {
		if (node.tag === 'contact') {
			assertNodeErrorFree(node)
			const type = node.attrs?.type
			return type === 'in'
		}
		return false
	}
}
