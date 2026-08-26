
  
  create view "local_analytics"."main"."orders__dbt_tmp" as (
    SELECT * FROM read_csv_auto('models/orders.csv')
  );
