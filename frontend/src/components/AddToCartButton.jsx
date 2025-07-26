import React from 'react';
import useCart from '../hooks/useCart';
import { Button } from 'antd'
import { RiAddFill } from '@remixicon/react';

export default function AddToCartButton({ form, loading, label = 'Add to Cart' }) {

  return (
    <Button type="default" htmlType="submit" icon={<RiAddFill />} loading={loading}> {label} </Button>
  );
}
