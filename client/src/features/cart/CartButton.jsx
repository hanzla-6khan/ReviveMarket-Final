import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Badge, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartDrawer from "./CartDrawer";
import { useSelector } from "react-redux";

const CartButton = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { items } = useSelector((state) => state.cart);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <IconButton onClick={() => setDrawerOpen(true)}>
        <Badge badgeContent={totalQuantity} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default CartButton;
