
  
  create view "local_analytics"."main"."users__dbt_tmp" as (
    SELECT * FROM read_csv_auto('models/users.csv')
  );
