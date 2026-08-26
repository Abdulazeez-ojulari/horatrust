
  
  create view "local_analytics"."main"."events__dbt_tmp" as (
    SELECT * FROM read_csv_auto('models/events.csv')
  );
