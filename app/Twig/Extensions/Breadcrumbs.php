<?php
/**
 * Settings extension for Twig.
 *
 * @author    MyBB Group
 * @version   2.0.0
 * @package   mybb/core
 * @copyright Copyright (c) 2015, MyBB Group
 * @license   http://www.mybb.com/licenses/bsd3 BSD-3
 * @link      http://www.mybb.com
 */

namespace MyBB\Core\Twig\Extensions;

use MyBB\Core\Subclasses\Breadcrumbs\Breadcrumbs as BreadcrumbStore;
use Twig_Extension;
use Twig_SimpleFunction;

class Breadcrumbs extends Twig_Extension
{
    /**
     * @var BreadcrumbStore $breadcrumbs
     */
    protected $breadcrumbs;

    /**
     * Create a new breadcrumbs extension.
     *
     * @param BreadcrumbStore $breadcrumbs
     */
    public function __construct(BreadcrumbStore $breadcrumbs)
    {
        $this->breadcrumbs = $breadcrumbs;
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'MyBB_Twig_Extensions_Breadcrumbs';
    }

    /**
     * {@inheritDoc}
     */
    public function getFunctions()
    {
        return [
            new Twig_SimpleFunction('renderBreadcrumbs', [$this->breadcrumbs, 'renderIfExists']),
        ];
    }
}
