<?php

namespace MyBB\Core\Presenters\Moderations;

use MyBB\Core\Form\Field;
use MyBB\Core\Form\RenderableInterface;
use MyBB\Core\Moderation\Moderations\MovePost;

class MovePostPresenter extends AbstractModerationPresenter implements ModerationPresenterInterface
{
	/**
	 * @return MovePost
	 */
	public function getWrappedObject()
	{
		return parent::getWrappedObject();
	}

	/**
	 * @return string
	 */
	public function icon()
	{
		return 'fa-arrow-right';
	}

	/**
	 * @return RenderableInterface[]
	 */
	public function fields()
	{
		return [
			(new Field(
				'text',
				'topic_id',
				trans('moderation.move_post_topic_id_name'),
				trans('moderation.move_post_topic_id_description')
			))->setValidationRules('integer|exists:topics,id'),
		];
	}

	/**
	 * @return string
	 */
	protected function getDescriptionView()
	{
		return 'partials.moderation.logs.move';
	}
}
