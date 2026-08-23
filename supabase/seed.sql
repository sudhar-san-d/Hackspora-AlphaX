begin;

insert into public.departments (code, name, description) values
('roads','Roads & Highways','Road pavement, shoulders, and highway response'),
('sanitation','Sanitation','Solid waste collection and illegal dumping response'),
('water','Water Services','Water supply and main leak response'),
('drainage','Drainage & Sewerage','Stormwater, drains, and sewer response'),
('electrical','Street Lighting','Public lighting and electrical asset response'),
('traffic','Traffic Management','Signals, lane safety, and traffic coordination'),
('public_safety','Public Safety','Immediate barriers and cross-agency safety response')
on conflict (code) do update set name = excluded.name, description = excluded.description, active = true;

with seed(reference,title,description,category,secondary,priority,score,status,department,address,lat,lng) as (values
('CT-1001','Deep pothole beside school crossing','Large deep pothole beside Central School and the Route 4 bus stop; buses swerve into traffic.','pothole','{}'::public.complaint_category[],'critical',85,'resolved','roads','Central School Rd & 5th Ave',13.08270,80.27070),
('CT-1002','Open drain at hospital entrance','Uncovered storm drain directly outside the emergency entrance with heavy pedestrian traffic.','open_drain','{}','critical',88,'assigned','drainage','General Hospital, North Gate',13.08710,80.27810),
('CT-1003','Burst main flooding intersection','Major water main burst is flooding two lanes and disabling the signal approach.','water_leakage','{road_damage}','critical',82,'in_progress','water','Harbor Rd & Market St',13.09020,80.28340),
('CT-1004','Traffic signal dark at junction','All traffic lights are dark at a busy four-way junction during peak hour.','traffic_signal','{}','high',72,'in_progress','traffic','Anna Blvd & Lake Rd',13.07540,80.25120),
('CT-1005','Garbage blocking market lane','Large dumped garbage pile blocks access behind the public market and attracts animals.','garbage','{}','high',68,'assigned','sanitation','Old Market Lane',13.08130,80.26420),
('CT-1006','Collapsed road shoulder','Road shoulder has collapsed beside a bus route, forcing cyclists into the vehicle lane.','road_damage','{}','high',64,'submitted','roads','Canal Bank Rd, Ward 3',13.09620,80.26010),
('CT-1007','Sewage overflow near apartments','Sewage is overflowing across the apartment entrance and footpath.','sewage','{}','high',77,'in_progress','drainage','Green Court Apartments',13.07080,80.26790),
('CT-1008','Flooded pedestrian underpass','Standing water fills the pedestrian underpass after rain and blocks safe passage.','flooding','{}','high',61,'triaged','drainage','East Station Underpass',13.08400,80.29110),
('CT-1009','Broken streetlight on footpath','Streetlight has failed along a frequently used evening footpath.','broken_streetlight','{}','medium',52,'assigned','electrical','Library Walk, Pole E-142',13.07920,80.27230),
('CT-1010','Potholes along residential street','Several potholes make the residential street difficult for two-wheelers.','pothole','{}','medium',48,'in_progress','roads','Jasmine Street, Ward 6',13.10120,80.24990),
('CT-1011','Water leak undermining pavement','Steady pipe leak is washing material from beneath the pavement edge.','water_leakage','{road_damage}','medium',55,'assigned','water','Temple Rd near No. 18',13.06870,80.28150),
('CT-1012','Overflowing public bins','Three public bins have overflowed since the weekend.','garbage','{}','medium',41,'submitted','sanitation','Riverside Park South Gate',13.09310,80.27360),
('CT-1013','Missing drain grate','Drain grate is missing beside a bicycle lane and needs a barrier.','open_drain','{}','medium',58,'triaged','drainage','College Ave Cycle Lane',13.07720,80.25810),
('CT-1014','Streetlight flickering nightly','Lamp alternates on and off every few minutes along the block.','broken_streetlight','{}','medium',45,'resolved_pending_verification','electrical','Beach Rd, Pole B-77',13.05830,80.28440),
('CT-1015','Cracked asphalt at lane edge','Asphalt has cracked and lifted along approximately four metres of the lane edge.','road_damage','{}','medium',37,'submitted','roads','Museum Crescent',13.07410,80.28620),
('CT-1016','Small pothole in parking bay','A shallow pothole is forming in a low-speed public parking bay.','pothole','{}','low',28,'triaged','roads','Civic Centre Parking B',13.08820,80.26910),
('CT-1017','Litter beside community hall','Several bags and loose litter were left beside the community hall bins.','garbage','{}','low',22,'submitted','sanitation','West Ward Community Hall',13.10210,80.27540),
('CT-1018','Single park lamp out','One lamp is not working in the small neighborhood park.','broken_streetlight','{}','low',31,'assigned','electrical','Lotus Pocket Park',13.06550,80.25480),
('CT-1019','Slow tap-box leak','A slow clean-water leak is visible inside the roadside meter box.','water_leakage','{}','low',18,'resolved','water','22 Orchard Close',13.09770,80.28820),
('CT-1020','Faded patch breaking up','An old utility patch is beginning to crumble on a quiet service road.','road_damage','{}','low',12,'submitted','roads','Depot Service Rd',13.06120,80.26270)
), numbered as (
  select *, row_number() over (order by reference) as n from seed
)
insert into public.complaints (
  id,reference,title,description,category,secondary_categories,priority,priority_score,status,priority_breakdown,
  latitude,longitude,address,reporter_id,analysis,decision,created_at,updated_at
)
select
  ('00000000-0000-4000-8000-' || lpad(n::text,12,'0'))::uuid, reference,title,description,category::public.complaint_category,
  secondary,priority::public.complaint_priority,score,status::public.complaint_status,
  case when reference='CT-1001' then '{"severity":32,"safety":20,"vulnerability":15,"location":13,"spread":5}'::jsonb
       else jsonb_build_object('severity',least(35,round(score*.35)),'safety',least(25,round(score*.25)),'vulnerability',least(15,round(score*.15)),'location',least(15,round(score*.15)),'spread',greatest(0,score-round(score*.9))) end,
  lat,lng,address,'demo-citizen-' || (((n-1)%5)+1),
  jsonb_build_object('category',category,'secondaryCategories',to_jsonb(secondary),'severity',least(100,round(score*1.1)),'confidence',.89,'observedFacts',jsonb_build_array('Demo evidence associated with report.'),'hazards',case when score>=60 then jsonb_build_array('Public safety or access impact') else '[]'::jsonb end,'imageQuality','clear','requiresHumanReview',false,'source','openrouter'),
  jsonb_build_object('category',category,'priority',priority,'priorityScore',score,'priorityBreakdown',case when reference='CT-1001' then '{"severity":32,"safety":20,"vulnerability":15,"location":13,"spread":5}'::jsonb else jsonb_build_object('severity',round(score*.35),'safety',round(score*.25),'vulnerability',round(score*.15),'location',round(score*.15),'spread',score-round(score*.9)) end,'departments',case when category='water_leakage' and secondary @> '{road_damage}'::public.complaint_category[] then jsonb_build_array('water','roads','traffic') else jsonb_build_array(department) end,'responseDueAt',(timestamptz '2026-08-01 08:00:00+00' + (n-1)*interval '1 day' + case priority when 'critical' then interval '6 hours' when 'high' then interval '12 hours' when 'medium' then interval '48 hours' else interval '120 hours' end),'resolutionDueAt',(timestamptz '2026-08-01 08:00:00+00' + (n-1)*interval '1 day' + case priority when 'critical' then interval '6 hours' when 'high' then interval '12 hours' when 'medium' then interval '48 hours' else interval '120 hours' end),'reasoning',jsonb_build_array('Seeded deterministic priority score '||score||'/100.','Routed to '||department||'.'),'requiresHumanReview',false,'source','deterministic_fallback'),
  timestamptz '2026-08-01 08:00:00+00' + (n-1)*interval '1 day', timestamptz '2026-08-02 12:00:00+00' + (n-1)*interval '1 day'
from numbered
on conflict (reference) do nothing;

insert into public.complaint_ai_analysis (complaint_id,provider,model,image_analysis,confidence,created_at)
select id,analysis->>'source','seeded-demo-model',analysis,(analysis->>'confidence')::double precision,created_at
from public.complaints where reference between 'CT-1001' and 'CT-1020'
on conflict (complaint_id) do nothing;

insert into public.complaint_decisions (complaint_id,decision,priority_score,priority_level,sla_due_at,created_at)
select id,decision,priority_score,priority,(decision->>'resolutionDueAt')::timestamptz,created_at
from public.complaints where reference between 'CT-1001' and 'CT-1020'
on conflict (complaint_id) do nothing;

insert into public.status_history (complaint_id,status,note,actor_id,created_at)
select id,'submitted','Complaint submitted',reporter_id,created_at from public.complaints where reference between 'CT-1001' and 'CT-1020'
union all
select id,status,'Demo case moved to '||status::text,'demo-dispatcher-1',updated_at from public.complaints where reference between 'CT-1001' and 'CT-1020';

insert into public.assignments (complaint_id,department,assignee_id,assigned_by,created_at)
select c.id,
  case c.category when 'pothole' then 'roads' when 'garbage' then 'sanitation' when 'open_drain' then 'drainage' when 'broken_streetlight' then 'electrical' when 'water_leakage' then 'water' when 'road_damage' then 'roads' when 'traffic_signal' then 'traffic' when 'flooding' then 'drainage' when 'sewage' then 'drainage' else 'public_safety' end::public.department_code,
  'demo-worker-'||((right(c.reference,2)::int%4)+1),'demo-dispatcher-1',c.updated_at
from public.complaints c where reference between 'CT-1001' and 'CT-1020';

insert into public.evidence (complaint_id,kind,url,mime_type,size_bytes,latitude,longitude,created_at)
select id,'initial','data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22640%22%20height=%22480%22%3E%3C/svg%3E','image/svg+xml',120,latitude,longitude,created_at
from public.complaints where reference between 'CT-1001' and 'CT-1020';
insert into public.evidence (complaint_id,kind,url,mime_type,size_bytes,latitude,longitude,created_at)
select id,'resolution','data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22640%22%20height=%22480%22%3E%3C/svg%3E','image/svg+xml',120,latitude+0.00005,longitude+0.00005,updated_at
from public.complaints where status in ('resolved','resolved_pending_verification') and reference between 'CT-1001' and 'CT-1020';

insert into public.verification (complaint_id,visual_score,gps_distance_meters,confidence,passed,notes,source,created_at)
select id,91,8,0.93,true,array['Pothole fill is visibly level with surrounding asphalt.','GPS evidence is within the 100 metre threshold.'],'demo_seed',updated_at
from public.complaints where reference='CT-1001'
on conflict (complaint_id) do update set visual_score=91,gps_distance_meters=8,confidence=.93,passed=true,notes=excluded.notes,source='demo_seed';

insert into public.notifications (user_id,complaint_id,title,message,read,created_at)
select 'demo-citizen-1',id,'CT-1001 resolved','Your pothole report was resolved and verified at 93% confidence.',false,'2026-08-23 09:00:00+00' from public.complaints where reference='CT-1001';

-- Fail the seed transaction if the required demo distribution drifts.
do $$
declare counts int[];
begin
  select array[
    count(*) filter (where priority='critical'), count(*) filter (where priority='high'),
    count(*) filter (where priority='medium'), count(*) filter (where priority='low')
  ] into counts from public.complaints where reference between 'CT-1001' and 'CT-1020';
  if counts <> array[3,5,7,5] then raise exception 'Invalid demo priority distribution: %', counts; end if;
end $$;

commit;
