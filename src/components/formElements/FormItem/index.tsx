import type { FC } from 'react'
import React from 'react'

import type { FormItemProps } from 'antd'
import { Form } from 'antd'

import { cn } from '../../../utils/helpers'

interface IProps extends FormItemProps {
    children: React.ReactNode
    validateStatus?: 'error' | 'warning' | 'success' | ''
    help?: React.ReactNode
    className?: string
}

const FormItem: FC<IProps> = ({ children, validateStatus, help, className, ...rest }) => (
    <Form.Item className={cn('mb-0', className)} validateStatus={validateStatus} help={help} {...rest}>
        {children}
    </Form.Item>
)

export default FormItem
