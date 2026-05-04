# TODO: Fix Restaurant Display Issue

## Steps to Complete:

### 1. ✅ Update backend schema and controller
- ✅ Read Restaurant_info model and controller
- ✅ Plan approved by user
- ✅ Update Restaurant_info.js: Change MaxGuests to String type
- ✅ Update restaurantController.js: Fix data mapping consistency (Price/Rating to null if undefined)

### 2. Test backend fixes
- Restart server
- Call GET /api/restaurants to repopulate DB
- Verify no validation errors in console

### 3. Verify frontend compatibility
- Check RestaurantCard.js and RestaurantList components
- Ensure field names match backend (RestaurantName, MaxGuests, etc.)
- Test restaurant page displays data

### 4. Handle any similar issues
- Check Hotel_info model for same problem
- Final testing and completion

