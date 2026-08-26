
  
  create view "local_analytics"."main"."metricflow_time_spine__dbt_tmp" as (
    SELECT 
    cast(range AS DATE) AS date_day
FROM range(date '2020-01-01', date '2030-12-31', interval '1' day)
  );
