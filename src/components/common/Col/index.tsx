import type { FC } from 'react'

import type { ColProps as ColAntProps } from 'antd'
import { Col as ColAnt } from 'antd'

const Col: FC<ColAntProps> = ({ children, ...props }) => <ColAnt {...props}>{children}</ColAnt>

export { Col }
