import type { FC } from 'react'

import type { RowProps as RowAntProps } from 'antd'
import { Row as RowAnt } from 'antd'

const Row: FC<RowAntProps> = ({ children, ...props }) => <RowAnt {...props}>{children}</RowAnt>

export { Row }
