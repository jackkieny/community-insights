
def job_to_dict(job_):
    return {
        'id': job_.id,
        'name': job_.name,
        'next_run_time': job_.next_run_time,
        'trigger': str(job_.trigger),
        'executor': str(job_.executor),
        'args': job_.args,
        'kwargs': job_.kwargs,
        'misfire_grace_time': job_.misfire_grace_time,
        'coalesce': job_.coalesce,
        'max_instances': job_.max_instances,
    }