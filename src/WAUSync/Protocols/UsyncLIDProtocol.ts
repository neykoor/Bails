import { USyncQueryProtocol } from '../../Types/USync'
import { BinaryNode, getBinaryNodeChild } from '../../WABinary'

export class USyncBotProfileProtocol implements USyncQueryProtocol {
	name = 'bot_profile'

	getQueryElement(): BinaryNode {
		return {
			tag: 'bot_profile',
			attrs: {},
		}
	}

	getUserElement(): null {
		return null
	}

	parser(node: BinaryNode): { about?: string; category?: string } | null {
		if (node.tag !== 'bot_profile' || !Array.isArray(node.content)) return null

		const aboutNode = getBinaryNodeChild(node, 'about')
		const categoryNode = getBinaryNodeChild(node, 'category')

		return {
			about: aboutNode?.content?.toString(),
			category: categoryNode?.content?.toString(),
		}
	}
}
