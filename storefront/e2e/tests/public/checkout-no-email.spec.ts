import { test, expect } from "../../index"

test.describe("Checkout with phone-based guest email tests", async () => {
  test("Checkout flow with phone-based guest email when none provided", async ({
    cartPage,
    checkoutPage,
    orderPage,
    productPage,
    storePage,
  }) => {
    await test.step("Navigate to a product page", async () => {
      await storePage.goto()
      const product = await storePage.getProduct("Sweatshirt")
      await product.locator.highlight()
      await product.locator.click()
      await productPage.container.waitFor({ state: "visible" })
    })

    await test.step("Add the product to the cart and goto checkout", async () => {
      await productPage.selectOption("M")
      await productPage.clickAddProduct()
      await productPage.cartDropdown.navCartLink.click()
      await productPage.cartDropdown.goToCartButton.click()
      await cartPage.container.waitFor({ state: "visible" })
      await cartPage.checkoutButton.click()
      await checkoutPage.container.waitFor({ state: "visible" })
    })

    await test.step("Enter in the first step of the checkout process without email", async () => {
      await test.step("Enter in the shipping address info", async () => {
        await checkoutPage.shippingFirstNameInput.fill("First")
        await checkoutPage.shippingLastNameInput.fill("Last")
        await checkoutPage.shippingCompanyInput.fill("MyCorp")
        await checkoutPage.shippingAddressInput.fill("123 Fake street")
        await checkoutPage.shippingPostalCodeInput.fill("80010")
        await checkoutPage.shippingCityInput.fill("Denver")
        await checkoutPage.shippingProvinceInput.fill("Colorado")
        await checkoutPage.shippingCountrySelect.selectOption("United States")
      })

      await test.step("Enter in the contact info (phone only, no email)", async () => {
        // Note: We're not filling the email field, so the frontend will generate a guest email based on phone number
        await checkoutPage.shippingPhoneInput.fill("3031112222")
        await checkoutPage.submitAddressButton.click()
      })
    })

    await test.step("Complete the rest of the payment process", async () => {
      await checkoutPage.selectDeliveryOption("FakeEx Standard")
      await checkoutPage.submitDeliveryOptionButton.click()
      await checkoutPage.submitPaymentButton.click()
      await checkoutPage.submitOrderButton.click()
      await orderPage.container.waitFor({ state: "visible" })
    })

    await test.step("Verify order completion with phone-based guest email", async () => {
      // Verify that the order page loads successfully
      await expect(orderPage.container).toBeVisible()
      
      // Verify that the order ID is displayed
      await expect(orderPage.orderId).toBeVisible()
      
      // Verify that the order date is displayed
      await expect(orderPage.orderDate).toBeVisible()
      
      // Verify that email confirmation message is shown (with phone-based guest email)
      await expect(orderPage.orderEmail).toBeVisible()
      // Check that the email follows the guest pattern (guest + full phone number + @fakeemail.fake)
      // Phone number is 3031112222, so full number is 3031112222
      await expect(orderPage.orderEmail).toHaveText(/guest3031112222@fakeemail\.fake/)
    })
  })
}) 