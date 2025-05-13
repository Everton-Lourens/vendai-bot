-- Pegando item especifico de um cliente que está com status 'open'
SELECT my_item.*, my_customer.status, customer_item.quantity
FROM customer_item
JOIN item my_item ON customer_item.item_id = my_item.id
JOIN customer my_customer ON customer_item.customer_id = my_customer.id
WHERE my_customer.id = '07fe2e93-e0e4-4326-a28b-e79a9823f729' -- $1
AND my_customer.status = 'open' OR my_customer.status = 'in_progress';